const fromText = document.querySelector('.fromText');
const toText = document.querySelector('.toText');
const swapIcon = document.querySelector('.swap');
const selectTag = document.querySelectorAll('select');
const icons = document.querySelectorAll('.row i');
const translateButton = document.querySelector('button');
const synth = window.speechSynthesis;

//function to get all languages for select HTML element
selectTag.forEach((tag, id) => {
    for (let country in countries) {
        let selectedCountry = id == 0 ? country == "en-GB" ? "selected" : "" : country == "fr-FR" ? "selected" : "";
        let option = `<option ${selectedCountry} value="${country}">${countries[country]}</option>`;
        tag.insertAdjacentHTML('beforeend', option);
    }
});

//function to swap between 2 values
swapIcon.addEventListener('click', () => {
    //simple swap procedure, x = 1, y = 2
    //to swap, create temp value to store x. then make x = y. and then make y = temp value
    let tempText = fromText.value;
    let tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
})

//function to delete all text if original text is removed
fromText.addEventListener("keyup", () => {
    if (!fromText.value) {
        toText.value = "";
    }
});

//function to translate text
translateButton.addEventListener("click", () => {
    let text = fromText.value.trim(); //remove spaces from text
    let translateFrom = selectTag[0].value;
    let translateTo = selectTag[1].value;

    if (!text) return; //do nothing if original text is empty

    toText.setAttribute("placeholder", "Translating...");
    let apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiURL)
        .then(response => response.json()) //json response from server
        .then(data => {
            //get api data, responseData object, inside also has translatedText object. set this translatedText to the toText value
            toText.value = data.responseData.translatedText;
            data.matches.forEach(data => {
                if (data.id === 0) {
                    toText.value = data.translation; //data.matches has specific ID. This replaces translation object in the API
                }
            });
            toText.setAttribute("placeholder", "Translation");
        });
});

//speaking function and copy function
icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (!fromText.value && !toText.value) return; //if nothing is in textboxes for either field, do nothing
        if (target.classList.contains("fa-copy")) { //if user selects copy button
            if (target.id == "from") {
                navigator.clipboard.writeText(fromText.value); //keep fromText if user selects fromText copy
            } else {
                navigator.clipboard.writeText(toText.value); //keep toText if user selects toText copy
            }
        } else {
            let voices = synth.getVoices();
            if (target.id == "from") {
                var utterThis = new SpeechSynthesisUtterance(fromText.value); //set voices to be the fromText value
                utterThis.lang = selectTag[0].value;
                synth.speak(utterThis);  //speak function
            } else {
                var utterThis = new SpeechSynthesisUtterance(toText.value); //set voices to be toText value
                utterThis.lang = selectTag[1].value;
                synth.speak(utterThis);  //speak function
            }
            asdfasdfsa
        }
    });
});