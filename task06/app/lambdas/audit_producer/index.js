import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { PutCommand } from "@aws-sdk/lib-dynamodb";

import { v4 as uuidv4 } from "uuid";

import { unmarshall } from "@aws-sdk/util-dynamodb";

// Initialize the DynamoDB Client

const dynamoDBClient = new DynamoDBClient({ region: "eu-central-1" });

// Get the target Audit Table from the environment variables

const AUDIT_TABLE = process.env.TARGET_TABLE;

// Main Lambda Handler

export const handler = async (event) => {

    try {

        console.log("Received event:", JSON.stringify(event, null, 2));

        const auditEntries = [];

        // Process each record from DynamoDB Stream

        for (const record of event.Records) {

            // Extract eventName, NewImage, and OldImage

            const eventName = record.eventName;

            const newImage = record.dynamodb.NewImage

                ? unmarshall(record.dynamodb.NewImage)

                : {};

            const oldImage = record.dynamodb.OldImage

                ? unmarshall(record.dynamodb.OldImage)

                : {};

            console.log("Parsed NewImage:", newImage);

            console.log("Parsed OldImage:", oldImage);

            // Extract the item key (fallback to a default if not found)

            const itemKey = newImage.key || oldImage.key || "UNKNOWN_KEY";

            // Set the modification timestamp

            const modificationTime = new Date().toISOString();

            // Prepare the audit entry structure

            let auditEntry = {

                id: uuidv4(),               // Unique ID for the audit record

                itemKey,                   // The configuration key

                modificationTime,

                updatedAttribute: "value", // Assuming the only tracked attribute is "value"

                oldValue: null,

                newValue: null

            };

            // Handle INSERT event

            if (eventName === "INSERT") {

                auditEntry.newValue = newImage.value || null; // Extract only the "value" attribute

            }

            // Handle MODIFY event

            else if (eventName === "MODIFY") {

                auditEntry.oldValue = oldImage.value || null; // Extract only the "value" of the old image

                auditEntry.newValue = newImage.value || null; // Extract the new "value" attribute

            }

            console.log("Prepared Audit Entry:", auditEntry);

            // Queue the audit entry for writing to DynamoDB

            auditEntries.push(

                dynamoDBClient.send(

                    new PutCommand({

                        TableName: AUDIT_TABLE,

                        Item: auditEntry

                    })

                ).catch((dbError) => {

                    console.error("DynamoDB Put Error:", dbError);

                })

            );

        }

        // Wait for all items to be written to DynamoDB

        await Promise.all(auditEntries);

        // Return success response to complete the function

        return {

            statusCode: 200,

            headers: { "Content-Type": "application/json" },

            body: JSON.stringify({ message: "Success" })

        };

    } catch (error) {

        console.error("Error processing DynamoDB Event:", error);

        return {

            statusCode: 500,

            body: JSON.stringify({ message: "Internal Server Error", error: error.message })

        };

    }

};
