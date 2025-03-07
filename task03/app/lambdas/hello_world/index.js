exports.handler = async (event) => {
    // Constructing the correct response
    const response = {
        statusCode: 200,
        message: 'Hello from Lambda',  // No need for JSON.stringify here
    };
    return response;
};