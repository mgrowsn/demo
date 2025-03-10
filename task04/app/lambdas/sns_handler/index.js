exports.handler = async (event) => {
    event.Records.forEach(record => {
        const snsMessage = record.Sns.Message; // Access the SNS message content
        console.log("Message received from SNS:", snsMessage); // Log to CloudWatch Logs
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Messages processed successfully" })
    };
};