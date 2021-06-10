window.onclick = e => {    
    const id = e.target.id;
    switch(e.target.id){
        case 'supreme-logo':
            window.location.href = "supreme.html";
            break;
        case 'nikesnkrs-logo':
            window.location.href = "nikesnkrs.html";
            break;
        default:
            window.location.href = "index.html";
    }
} 