import * as core from '@actions/core';
import { DropboxTeam, Dropbox, sharing } from 'dropbox';
import fetch from 'node-fetch'
import * as fs from 'fs';

// names of the input parameters
const INPUT_DROPBOX_API_KEY = 'dropbox-api-key';
const INPUT_DROPBOX_SOURCE_FILE_PATH = 'dropbox-source-file-path';
const INPUT_DROPBOX_DESTINATION_FILE_PATH = 'dropbox-destination-file-path';

async function run() {
    try {
        const dropboxAPIKey = core.getInput(INPUT_DROPBOX_API_KEY);
        let dropboxSourceFilePath = core.getInput(INPUT_DROPBOX_SOURCE_FILE_PATH);
        let dropboxDestinationFilePath = core.getInput(INPUT_DROPBOX_DESTINATION_FILE_PATH);

        // check if the file doesn't exist in the file system
        // to skip the rest of the action, because the file is required for this action
        if (!fs.existsSync(dropboxSourceFilePath)) {
            core.setFailed("Received file doesn't exist.");
            return;
        }

        let dropbox = new Dropbox({ accessToken: dropboxAPIKey, fetch });
        dropbox.filesUpload({path: dropboxDestinationFilePath, contents: fs.createReadStream(dropboxSourceFilePath)})
            .then(function(response) {
                core.info("The file is successfully uploaded.");
            })
            .catch(function(error) {
                core.setFailed(error);
            });
    } catch(exception) {
        core.setFailed(exception);
    }
}

run();