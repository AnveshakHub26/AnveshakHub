const autocannon = require('autocannon');

async function runBenchmark() {
  console.log('🚀 Starting AnveshakHub Enterprise Backend Autocannon Load Benchmark...');

  const instance = autocannon({
    url: 'http://localhost:4000/health',
    connections: 20,
    duration: 5,
  }, (err, res) => {
    if (err) {
      console.error('Benchmark Error:', err);
    } else {
      console.log('📊 Autocannon Load Benchmark Results:');
      console.log(`Requests/sec: ${res.requests.average}`);
      console.log(`Latency p99: ${res.latency.p99} ms`);
      console.log(`Throughput: ${(res.throughput.average / 1024 / 1024).toFixed(2)} MB/s`);
    }
  });

  autocannon.track(instance, { renderProgressBar: true });
}

runBenchmark();
