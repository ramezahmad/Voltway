const tips = document.getElementById("tips");
const tipsGiven = document.getElementById("maintenance-tips");

tipsGiven.innerHTML = `<p>Please select a distance to see maintenance tips</p>`

tips.onchange = ()=>{
    if(tips.value == '0'){
        tipsGiven.innerHTML = `<p>Please select a distance to see maintenance tips</p>`
    }
    else if (tips.value == '1'){
        tipsGiven.innerHTML = `
            <p><b>1) Tire Rotation: </b>Rotate tires every 10,000-12,000 kilometers to ensure even wear.</p>
        `
    }
    else if (tips.value == '2'){
        tipsGiven.innerHTML = `
            <p><b>1) Charging Port Maintenance: </b>Keep the charging port clean and free from debris to ensure efficient charging, especially after 20,000 kilometers.</p>
        `
    }
    else if(tips.value == '3') {
        tipsGiven.innerHTML = `
            <p><b>1) Brake Inspection: </b>Check brake system components around 20,000-30,000 kilometers to assess wear and tear.</p>
            <p><b>2) Cabin Air Filter: </b>Replace the cabin air filter every 20,000-30,000 kilometers for clean and efficient air circulation.</p>
            <p><b>3) Wheel Alignment: </b>Check wheel alignment at 20,000-30,000 kilometers to prevent uneven tire wear and maintain driving stability.</p>
        `
    }
    else if(tips.value == '4') {
        tipsGiven.innerHTML = `
            <p><b>1) Suspension Components:</b>  Inspect suspension components like shocks and struts every 30,000-40,000 kilometers for signs of wear.</p>
            
        `
    }
    else if(tips.value == '5'){
        tipsGiven.innerHTML = `
            <p><b>1) Drive Belt Inspection: </b>Examine the drive belt around 40,000 kilometers for any signs of wear or damage.</p>
        `
    }
    else if(tips.value == '6'){
        tipsGiven.innerHTML = `
            <p><b>1) Coolant System Check: </b>Inspect the coolant system at 40,000-50,000 kilometers to ensure proper functioning and prevent overheating.</p>
        `
    }
    else if (tips.value == '7'){
        tipsGiven.innerHTML = `
            <p><b>1) Battery Health: </b>Monitor the battery health regularly, especially after reaching 50,000 kilometers, to maintain optimal performance.</p>
            <p><b>2) Power Steering Fluid: </b> Verify power steering fluid levels and condition at 50,000 kilometers to ensure proper steering performance.</p>
        `
    }
}