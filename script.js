'use strict';
document.addEventListener("DOMContentLoaded", setup);

const api_endpoint = 'https://api.fda.gov/drug/event.json';


function setup(){
    const searchButton = document.getElementById('search');
    const symptomInput = document.getElementById('symptom');

    searchButton.addEventListener('click', getData);
    symptomInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter'){
            getData();
        }
    });
}


async function getData(){
    const symptom = document.getElementById('symptom').value;
    const resultsDiv = document.getElementById('results');

    resultsDiv.innerHTML ="";

    try{
        const response = await fetch(`${api_endpoint}?search=${symptom}`);
        const data = await response.json();

        const drugEvents = data.results;

        if (drugEvents.length === 0){
            resultsDiv.innerHTML = "No Drugs found for the specified symptom";
            return;
        }

        drugEvents.forEach((drugEvent) =>{
            const drugDiv = document.createElement('div');
            drugDiv.innerHTML = `
            <strong>Drug Name:</strong> ${drugEvent.patient.drug[0].medicinalproduct}<br>
            <strong>Drug Batch Num:</strong> ${drugEvent.patient.drug[0].drugbatchnumb}<br>
            <strong>Side Effect:</strong> ${drugEvent.patient.reaction[0].reactionmeddrapt}<br>  
            `;
            resultsDiv.appendChild(drugDiv);
        });
        
    }catch(error){
        console.error("Error",error);
        resultsDiv.innerHTML = "An error occured while fetching data. Please try again";
    }
}