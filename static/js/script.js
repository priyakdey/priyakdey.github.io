const proxyUrl = "https://cors-anywhere-priyakdey-fork.herokuapp.com/";
const blobUrl = "https://priyakdeyresume.blob.core.windows.net/resume/PriyakDey-SoftwareEngineer.pdf";
const newSubscriberUrl = "https://new-user-subscription-az-function.azurewebsites.net/api/add-subscriber";
const newSubscriberLocalUrl = "http://localhost:7071/api/add-subscriber";

const alertMessageTimeout = 2500;

// Function to download the resume
function downloadResume() {
  // Ref:
  // How to solve CORS issue: https://stackoverflow.com/a/43881141/10368507
  // Easiet Proxy Setup: https://github.com/Rob--W/cors-anywhere/
  const downloadFileAs = "PriyakDey-SoftwareEngineer.pdf";

  const url = proxyUrl + blobUrl;

  fetch(url)
    .then((response) => {
      const statuscode = response.status;
      if (statuscode !== 200) {
        throw new Error(
          `Could not fetch file. statuscode is ${statuscode} from server.`
        );
      }

      return response.blob();
    })
    .then((blobData) => {
      let binaryData = [];
      binaryData.push(blobData);
      let url = window.URL.createObjectURL(
        new Blob(binaryData, { type: "application/pdf" })
      );
      anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = downloadFileAs;
      anchor.click();
    })
    .catch((err) => console.error(err));
}

// Function to open the link in a new tab
function viewPDF() {
  window.open(blobUrl, "_blank");
}

// event handler for new subscriber
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const jsonData = jsonify(formData);
  addNewSubscriber(jsonData);
});

function jsonify(data) {
  const [nameArray, emailArray] = [...data.entries()];
  subsciberName = nameArray[1];
  subscriberEmail = emailArray[1];

  return {
    name: subsciberName,
    email: subscriberEmail,
  };
}

function addNewSubscriber(data) {
  const url = newSubscriberUrl;
  // const url = newSubscriberLocalUrl;              // TODO: we need to keep changing this for local

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      const statusCode = response.status;

      if (statusCode === 201) {
        document.getElementById("new-subscriber-message").innerText = "Thank you for subscribing...";

        setTimeout(() => {
          document.getElementById("new-subscriber-message").innerText = "";
        }, alertMessageTimeout);
      } else if (statusCode === 409) {
        document.getElementById("new-subscriber-message").innerText = "You have already subscribed!!";

        setTimeout(() => {
          document.getElementById("new-subscriber-message").innerText = "";
        }, 2500);
      } else {
        throw new Error(`Received ${statusCode} from server`);
      }
    })
    .catch((err) => console.error(err));
}
