const chai = require('chai');
const credentials = require('../github-credentials.json');
const Agent = require('../src/agent.js');

const should = chai.should();

describe('agent', () => {
  it('should fetch pull requests', (done) => {
    const owner = 'spring-projects';
    const repo = 'spring-kafka';
    const agent = new Agent(credentials);
    agent.fetchAndProcessAllPullRequests(owner, repo, (err, pullRequests) => {
      should.not.exist(err);
      pullRequests.should.be.an('array');
      done();
    });
  });
});
