exports.handler = async (event) => {
    event.Records.forEach(record => {
        const messageBody = record.body; // Get the message body from the record
        console.log("Message received from SQS:", messageBody); // Log to CloudWatch Logs
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Messages processed successfully" })
    };
};