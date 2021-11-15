import { buildInformation as runtimeBuildInformation } from "@nmshd/runtime";

export const buildInformation = {
    version: "{{version}}",
    build: "{{build}}",
    date: "{{date}}",
    commit: "{{commit}}",
    runtimeVersion: runtimeBuildInformation.version
};
