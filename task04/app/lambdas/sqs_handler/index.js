exports.handler = async (event) => {
    // Loop through each record received from SQS
    event.Records.forEach(record => {
        const messageBody = record.body; // Get the message body from the record
        console.log("Message received from SQS:", messageBody); // Log to CloudWatch Logs
    });

    // Return a success response
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Messages processed successfully" })
    };
};