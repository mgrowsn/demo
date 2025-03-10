exports.handler = async (event) => {
    // Loop through each SNS record (message)
    event.Records.forEach(record => {
        const snsMessage = record.Sns.Message; // Access the SNS message content
        console.log("Message received from SNS:", snsMessage); // Log to CloudWatch Logs
    });

    // Return a success response
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Messages processed successfully" })
    };
};