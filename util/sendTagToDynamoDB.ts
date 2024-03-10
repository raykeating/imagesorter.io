import { v4 as uuid } from "uuid";

export default function sendTagToDynamoDB(tagName: string) {

    // check if sessionStorage has a userReferenceID
    let userReferenceID = sessionStorage.getItem("userReferenceID");
    if (userReferenceID === null) {
        userReferenceID = uuid();
        sessionStorage.setItem("userReferenceID", userReferenceID);
    }

    const endpoint = "https://4b3w2xfn3i.execute-api.us-east-1.amazonaws.com/v1";

    const body = {
        "TagName": tagName,
        "UserReferenceID": userReferenceID
    };

    fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Api-Key": "5KyIx3r4np73NlYfalIvx9NehEVhYEH03F65oWc9",
        },
        body: JSON.stringify(body)
    });
}