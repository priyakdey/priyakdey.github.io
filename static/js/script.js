function download() {
    fetch("https://priyakdeyresume.blob.core.windows.net/resume/PriyakDey-7-SoftwareEngineer.pdf")
    .then(response => console.log(response.blob))
    .catch(err => console.error(err))
}


// https://priyakdeyresume.blob.core.windows.net/resume/PriyakDey-7-SoftwareEngineer.pdf

// https://myaccount.blob.core.windows.net/mycontainer/myblob?snapshot=<DateTime>