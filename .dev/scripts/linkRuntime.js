const nodemon = require("nodemon");
const path = require("path");

const runtimePath = process.env.RUNTIME_PATH;
if (!runtimePath) {
    console.error("Please provide the path via the .env in the root folder file");
    process.exit(1);
}

const packages = ["consumption", "content", "iql", "runtime", "transport"];
const watch = packages.map((pkg) => path.resolve(`${runtimePath}/packages/${pkg}/**/*.*`));
nodemon({
    script: ".dev/scripts/copyRuntime.sh",
    exec: "bash",
    watch: watch,
    ext: "js,ts,map",
    delay: 1000
});
