const core = require('@actions/core');


// Get input as declared in action.yaml
const serverUrl = core.getInput('serverUrl');
const apiKey = core.getInput('apiKey');
const bomFile = core.getInput('bomFile');
const projectUUID = core.getInput('projectUUID');
const projectName = core.getInput('projectName');
const projectVersion = core.getInput('projectVersion');
const autoCreate = core.getInput('autoCreate');

const nameVersion = projectName !== "" && projectVersion !== "";

if (projectUUID === "" && !nameVersion) {
  throw new Error('One of project OR (projectName and projectVersion) must be set');
}
if (project !== "" && nameVersion) {
  throw new Error('Either project XOR (projectName and projectVersion) must be set');
}

const meta = new Map();
meta.set('X-API-Key', apiKey);
const headers = new fetch.Headers(meta);

const formData = new FormData.FormData();
formData.set('bom', await fileFromPath(bomFile), path.basename(bomFile));
formData.set('autoCreate', autoCreate);
if (projectUUID !== "") {
  formData.set('project', projectUUID)
} else {
  formData.set('projectName', projectName)
  formData.set('projectVersion', projectVersion)
}

const response = await fetch(serverUrl,
  {
    method: 'POST',
    headers: headers,
    body: formData,
  });

const statusCode = response.status;
core.setOutput("statusCode", statusCode);
// output as declared in action.yaml
core.setOutput("statusCode", statusCode);
// build failure
core.setFailed("Some error");