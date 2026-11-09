Service	Ingress Type	User Editable Properties	Capacity Formula	Default Values	Derived Capacity
API Gateway V2	THROTTLE	rateLimitRps	capacity = rateLimitRps	10000 rps	10000 rps
Lambda	THROTTLE	concurrency, averageDurationMs	capacity = concurrency / (averageDurationMs / 1000)	1000 concurrency, 250ms duration	4000 rps
EC2	QUEUE	instanceCount, requestsPerInstancePerSecond, maxQueueDepth, timeoutSeconds	capacity = instanceCount * requestsPerInstancePerSecond	2 instances, 250 rps each, 10000 queue, 30s timeout	500 rps
DynamoDB	THROTTLE	readCapacityUnits, writeCapacityUnits	capacity = RCU + WCU	500 RCU, 500 WCU	1000 ops/s
SQS	QUEUE	consumerCount, averageProcessTimeMs, maxQueueDepth	capacity = consumerCount / (averageProcessTimeMs / 1000)	10 consumers, 100ms processing, 1000000 queue	100 msg/s
S3	THROTTLE	requestLimitRps	capacity = requestLimitRps	3500 rps	3500 rps


Queue Behaviour
Property	Meaning	Example
maxQueueDepth	Maximum requests/messages allowed in queue	10000
timeoutSeconds	Maximum time a request can wait before failing	30s
queueDepth	Current backlog size	Derived
waitTimeSeconds	Estimated wait time	queueDepth / capacityRps
droppedRequests	Requests rejected because queue is full	Derived
timedOutRequests	Requests accepted but waited too long	Derived


Throttle Behaviour
Property	Meaning
throttledRequests	Requests rejected immediately due to insufficient capacity
throttledPercentage	throttledRequests / incomingRequests * 100



Show these on every node:

TypeScript
{
incomingRate,
capacityRps,
utilisationPercent,
 
processedRequests,
 
queueDepth,
estimatedWaitTimeSeconds,
 
droppedRequests,
droppedPercentage,
 
timedOutRequests,
timedOutPercentage,
 
throttledRequests,
throttledPercentage
}