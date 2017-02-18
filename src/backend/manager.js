const assert = require("assert");
const child_process = require("child_process");
const uuid = require("uuid");

class Instance {
    constructor(binaryPath, port, pw) {
        assert(
            typeof(binaryPath) == "string"
            && typeof(port) == "number"
            && typeof(pw) == "string"
        );

        this.id = uuid.v4();
        this.state = "not_running";
        this.binaryPath = binaryPath;
        this.port = port;
        this.pw = pw;
        this.handle = null;
    }

    run() {
        if(this.handle) return false;

        this.handle = child_process.spawn(
            this.binaryPath,
            [
                "-p",
                this.port.toString(),
                "-k",
                this.pw,
                "-m",
                "aes-256-cfb"
            ]
        );

        this.state = "running";

        this.handle.on("exit", (code, signal) => {
            this.state = "exited";
            this.handle = null;
        });

        this.handle.on("error", err => {
            if(this.state == "killed") { // kill failed
                this.state = "running";
            } else {
                this.state = "not_running";
                this.handle = null;
            }
        });

        return true;
    }

    kill() {
        if(!this.handle) return false;
        this.handle.kill("SIGTERM");
        this.state = "killed";
        return true;
    }
}

export default class Manager {
    constructor(ssBinaryPath) {
        assert(typeof(ssBinaryPath) == "string");

        this.binaryPath = ssBinaryPath;
        this.instances = [];
    }

    runInstance(port, pw) {
        let instance = new Instance(this.binaryPath, port, pw);
        instance.run();

        this.instances.push(instance);

        return instance.id;
    }

    killInstance(id) {
        assert(typeof(id) == "string");

        let instance = null;

        for(let i = 0; i < this.instances.length; i++) {
            if(this.instances[i].id == id) {
                instance = this.instances[i];
                break;
            }
        }

        if(!instance) return false;
        instance.kill();
        return true;
    }

    removeStoppedInstances() {
        for(let i = 0; i < this.instances.length; ) {
            if(!this.instances[i].handle) {
                this.instances.splice(i, 1);
            } else {
                i++;
            }
        }
    }

    getInstances() {
        this.removeStoppedInstances();
        let instanceList = this.instances.map(v => {
            return {
                "id": v.id,
                "port": v.port,
                "pw": v.pw
            };
        });
        return instanceList;
    }
}
