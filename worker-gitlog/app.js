/*
 * USAGE:
 *         node app.js <DIR_WHERE_YOU_CLONED_THE_REPO> | curl -s -XPOST 192.168.99.100:9200/_bulk --data-binary @-
 *
 *          or
 * 
 *         node app.js <DIR_WHERE_YOU_CLONED_THE_REPO>
 *         curl -s -XPOST 192.168.99.100:9200/_bulk --data-binary "@requests"
 * 
 * This script invokes the 'git log' with a custom "pretty" format in order to get useful
 * information for every commit in the repository history. The list of properties is easily
 * configurable by tuning the script.
 * 
 * The script then generates a JSON file, which can be sent to Elasticsearch over the 
 * 'bulk' REST endpoint. This is faster than issuing a single HTTP request for every document.
 * 
 * At the end of the process, we have an index in Elasticsearch, where every document represents
 * a commit in the repo history.
 */

/*
 * Use standard node modules to execute shell commands (git) and to process their output line by line
 */
var spawn = require('child_process').spawn;
var readline = require('readline');
const path = require('path');

//var testscript = exec('git clone --progress https://github.com/elastic/elasticsearch.git', function(error, stdout, stderr) {

/*
 * Define which properties we want to extract from the 'git log' output. This can be customized if
 * we want to collect additional attributes. To see all attributes that are available, see https://git-scm.com/docs/pretty-formats.
 */
var properties = [];
properties.push({ name: 'Author date', flag: '%ad' });
properties.push({ name: 'Author name', flag: '%aN' });
properties.push({ name: 'Author email', flag: '%aE' });
properties.push({ name: 'Commit hash', flag: '%H' });
properties.push({ name: 'Subject', flag: '%s' });
var prettyFormat = "--pretty=format:";
properties.forEach(function (property) {
    prettyFormat += property.name + ":" + property.flag + '%n';
});


/*
 * Spawn a process and execute git log, with the proper "pretty" format that fits our need
 */
var repoDirectory = process.argv[2];
var testscript = spawn('git', ['log', '--date=iso-strict', prettyFormat], { cwd: repoDirectory });

var outputLines = readline.createInterface({
    input: testscript.stdout,
    output: testscript.stdin
});

var errorLines = readline.createInterface({
    input: testscript.stderr,
    output: testscript.stdin
});


/*
 * Process the output of the 'git log' command. For every commit in the history, our "pretty format"
 * generates 1 line for every property (commit hash, author date, etc.) + 1 empty line.
 */
var currentCommit;
var indexName = "commits-" + path.basename(repoDirectory).toLowerCase();
function processCommit(commit) {
    console.log('{ "index" : { "_index" : "' + indexName + '", "_type" : "commit" } }'); // we have encountered a blank line - we have a full commit
    console.log(JSON.stringify(currentCommit));
}
outputLines.on('line', function (line) {
    if (line.trim() !== "") {
        currentCommit = currentCommit ? currentCommit : { repoDirectory : indexName }; // it is the first property line of a new commit: initialize it
        var pos = line.indexOf(':');
        var property = line.substring(0, pos);
        var value = line.substring(pos + 1);
        currentCommit[property] = value;
    } else {
        processCommit(currentCommit);
        currentCommit = undefined;
    }
});

/*
 * Make sure to process the last line from git log
 */
outputLines.on('close', function () {
    processCommit(currentCommit);
});

errorLines.on('line', function(data){
    console.log(data);
});
