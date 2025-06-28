import fetch from "node-fetch";

const BASE_URL = "http://localhost:5000/api/messages";

const testUsers = {
    sender: "test-user-1",
    receiver: "test-user-2"
};

let testMessageId = null;

async function testEndpoints() {
    try {
        console.log("\n1. Testing send message endpoint...");
        const sendMessageResponse = await fetch(`${BASE_URL}/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                senderId: testUsers.sender,
                receiverId: testUsers.receiver,
                content: "Hello, this is a test message!",
                isAnonymous: false
            })
        });
        const messageData = await sendMessageResponse.json();
        console.log("Message sent:", messageData);
        testMessageId = messageData.id;
        console.log("\n2. Testing get chat history endpoint...");
        const historyResponse = await fetch(`${BASE_URL}/history/${testUsers.sender}/${testUsers.receiver}`);
        const historyData = await historyResponse.json();
        console.log("Chat history:", historyData);
        if (testMessageId) {
            console.log("\n3. Testing mark message as seen endpoint...");
            const seenResponse = await fetch(`${BASE_URL}/seen/${testMessageId}`, {
                method: "PUT"
            });
            const seenData = await seenResponse.json();
            console.log("Message marked as seen:", seenData);
        }
        console.log("\n4. Testing get unseen messages endpoint...");
        const unseenResponse = await fetch(`${BASE_URL}/unseen/${testUsers.receiver}`);
        const unseenData = await unseenResponse.json();
        console.log("Unseen messages:", unseenData);
    } catch (error) {
        console.error("Error during testing:", error);
    }
}

testEndpoints();