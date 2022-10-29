const proxyURL = "https://cors-anywhere-priyakdey-fork.herokuapp.com/";
const blobURL  = "https://priyakdeyresume.blob.core.windows.net/resume/PriyakDey-SoftwareEngineer.pdf";
    

// Function to download the resume
function downloadResume(){
    // Ref: 
    // How to solve CORS issue: https://stackoverflow.com/a/43881141/10368507
    // Easiet Proxy Setup: https://github.com/Rob--W/cors-anywhere/ 
    const downloadFileAs = "PriyakDey-SoftwareEngineer.pdf";

    const url = proxyURL + blobURL;

    fetch(url)
    .then(response => {
        const statuscode = response.status;
        if (statuscode !== 200) {
            throw new Error(`Could not fetch file. statuscode is ${statuscode} from server.`);
        }
        
        return response.blob();
    })
    .then(blobData => {
        let binaryData = [];
        binaryData.push(blobData);
        let url = window.URL.createObjectURL(new Blob(binaryData, {type: "application/pdf"}));
        anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = downloadFileAs;
        anchor.click();
    })
    .catch(err => console.error(err))
}

// Function to open the link in a new tab
function viewPDF(){
    window.open(blobURL, "_blank");
}

// event handler for new subscriber
document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const jsonData = jsonify(formData);
    addNewSubscriber(jsonData);
});


function jsonify(data){
    const [nameArray, emailArray] = [...data.entries()];
    subsciberName   = nameArray[1];
    subscriberEmail = emailArray[1];

    // TODO: Do we need to validate the email !!

    return {
        "name": subsciberName,
        "email": subscriberEmail
    };
}

function addNewSubscriber(data){
    // TODO: need to implement this
    console.log("TODO")

}