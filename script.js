const themeToggle = document.querySelector(".theme-toggle");
const promptForm = document.querySelector(".prompt-form");
const promptInput = document.querySelector(".prompt-input");
const promptBtn = document.querySelector(".prompt-btn");
const modelSelect = document.getElementById("model-select");
const countSelect = document.getElementById("count-select");
const ratioSelect = document.getElementById("ratio-select");
const gridGallery = document.querySelector(".gallery-grid");


const API_KEY ="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";  //hugging face API key 


const examplePrompts = [
    "A serene sunset over a lavender field in Provence, ultra-realistic, soft lighting, 4K resolution",
    "Snow-covered pine trees in a misty forest, morning light rays, cinematic style",
    "A tropical beach at dawn, pink sky reflections in calm water, photo-realistic" ,                                                       
    "A woman sipping coffee while reading a book by the window on a rainy day",
    "A man jogging in the park during sunrise, wearing headphones and sportswear",
    "A family having dinner together at a cozy dining table with warm lighting",
    "Students studying in a library with laptops, notebooks, and coffee cups",
    "A child playing with a puppy in the backyard on a sunny afternoon",
    "Busy street market in the evening, colorful stalls, people shopping, vibrant atmosphere",
    "A traffic jam during rush hour in a metropolitan city with honking cars and lights",
    "A barista making coffee at a modern cafe, with steam rising from the cup",
    "A young couple walking hand-in-hand on a city street with neon lights",
    "A cyclist riding past a graffiti-covered wall in an urban neighborhood",
    "A simple breakfast table with toast, butter, fruits, and orange juice",
    "A person grocery shopping with a basket filled with fresh vegetables and milk",
    "A tea stall with steaming cups of chai being served to office workers",
    "An office meeting room with people discussing around a table and charts on the wall",
    "A shopkeeper organizing items in a small grocery store",
    "A delivery person handing over a package at the door of a modern home",
                       
];

//set theme based on saved preferences or system default 
(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia ("(prefers-color-scheme: dark)").matches;

    const isDarkTheme = savedTheme ==="dark" || (!savedTheme && systemPrefersDark);
    document.body.classList.toggle("dark-theme", isDarkTheme);
    themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon" ;
}) ();
//switch between light and dark theme
const toggleTheme = () => {
    const isDarkTheme = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
    themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
};
//calculated width adn height based on chosen ratio 
const getImageDimensions = (aspectRatio, baseSize = 512) => {
    const [width, height] = aspectRatio.split("/").map(Number);
    const scaleFactor = baseSize / Math.sqrt(width * height);

    let calculatedWidth = Math.round(width * scaleFactor);
    let calculatedHeight = Math.round(height * scaleFactor);

    //ensure dimensions are multiple of 16
    calculatedWidth = Math.floor(calculatedWidth /16) *16;
    calculatedHeight = Math.floor(calculatedHeight /16)*16;
    return {width : calculatedWidth, height : calculatedHeight} ;
}; 


//replace loading spinner with actual image 
const updateImageCards = (imgIndex, imgUrl) => {
    const imgCard = document.getElementById(`img-card-${imgIndex}`);
    if(!imgCard) return;

    imgCard.classList.remove("loading");
    imgCard.innerHTML = `<img src="${imgUrl}" class="result-img" />
                            <div class="img-overlay">
                                <a href ="${imgUrl}" class="img-download-btn" download="${Date.now()}.png">
                                    <i class="fa-solid fa-download"></i>
                                </button>
                                </a>
                            </div>`;
};


/*
// Send requests to Hugging Face API to create images
const REPLICATE_API_TOKEN = "r8_e5VsRJ2Y3bMo0hH1lqE58WKexiLFwoZ0qQLcM";  // 🔑 Put your token here
const REPLICATE_MODEL_VERSION = "a9758cbf82f6e00e7d28db2dfbc5f8b6ad90fe65c9fdc51b0a3a2e3ed12d3d96"; // Stable Diffusion 1.5
async function generateImagesFromBackend(promptText, index) {
    try {
        const response = await fetch("http://localhost:3000/generate-image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: promptText })
        });

        const data = await response.json();
        if (data.imageUrl) {
            updateImageCards(index, data.imageUrl);
        } else {
            console.error("Image generation failed", data.error);
        }
    } catch (error) {
        console.error("Error from backend:", error);
    }
}

const generateImages = async (selectedModel, imageCount, aspectRatio, promptText) => {

    console.log("🟡 Sending prompt to backend:", promptText);
    const imagePromises = Array.from({ length: imageCount }, (_, i) =>
        generateImagesFromBackend(promptText, i)
    );
    await Promise.allSettled(imagePromises);
};
*/



/*
const generateImages = async (selectedModel, imageCount, aspectRatio, promptText) => {
    const imagePromises = Array.from({ length: imageCount }, async (_, i) => {
        try {
            // Step 1: Trigger generation
            const triggerResponse = await fetch("https://api.replicate.com/v1/predictions", {
                method: "POST",
                headers: {
                    Authorization: `Token ${REPLICATE_API_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    version: REPLICATE_MODEL_VERSION,
                    input: {
                        prompt: promptText
                    }
                })
            });

            const triggerData = await triggerResponse.json();
            const predictionId = triggerData.id;

            // Step 2: Polling until status is "succeeded"
            let imageUrl = "";
            while (!imageUrl) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
                    headers: {
                        Authorization: `Token ${REPLICATE_API_TOKEN}`
                    }
                });

                const statusData = await statusResponse.json();

                if (statusData.status === "succeeded") {
                    imageUrl = statusData.output[0];
                    updateImageCards(i, imageUrl);
                } else if (statusData.status === "failed") {
                    throw new Error("Image generation failed.");
                }
            }
        } catch (error) {
            console.error("Error generating image:", error);
        }
    });

    await Promise.allSettled(imagePromises);
};
*/

/*

const generateImages = async (selectedModel, imageCount, aspectRatio, promptText) => {
    const MODEL_URL = `https://api-inference.huggingface.co/models/${selectedModel}`;
    

    const { width, height } = getImageDimensions(aspectRatio);

    // Create an array of image generation promises 
    const imagePromises = Array.from({ length: imageCount }, async (_, i) => {
        try {
            const response = await fetch(MODEL_URL, {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: promptText,
                    parameters: {
                        width: width,
                        height: height
                    },
                    options: {
                        wait_for_model: true
                    }
                })
            });

            // If API response is not OK, handle error
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            // Convert response to image blob and update UI
            const result = await response.blob();
            const imageUrl = URL.createObjectURL(result);
            updateImageCards(i, imageUrl);

        } catch (error) {
            console.error(`Image ${i + 1} generation failed:`, error.message);
            updateImageCards(i, null); // Optional: show fallback or error image
        }
    });

    await Promise.allSettled(imagePromises);
};
*/


const generateImages = async (selectedModel, imageCount, aspectRatio, promptText) => {
    //const MODEL_URL =`https://router.huggingface.co/hf-inference/models/${selectedModel}`;
    //const MODEL_URL = `https://api-inference.huggingface.co/models/${selectedModel}`;
    const MODEL_URL = `https://api-inference.huggingface.co/models/${selectedModel}`;

    const {width, height} = getImageDimensions(aspectRatio);
    //create an array of image generation promises 
    const imagePromises = Array.from({length: imageCount}, async(_, i) => {
        //send request to the ai model api
        try {
        const response = await fetch(MODEL_URL, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
				"Content-Type": "application/json",
                "x-use-cache": "false",
			},
			method: "POST",
			body: JSON.stringify({
                inputs: promptText,
                parameters: {width, height},
                options: {wait_for_model:true, user_cache: false},
            }),
		});

        if (!response.ok) throw new Error((await response.json())?.error);

        //convert response to a image url and update the image card
        const result = await response.blob();
        updateImageCards(i, URL.createObjectURL(result));
    } catch (error) {
        console.log(error);

    }

    })

    await Promise.allSettled(imagePromises);

};



//create placeholder cards with loding spinners
const createImageCards = (selectedModel, imageCount, aspectRatio, promptText) => {
    gridGallery.innerHTML = "";
    for (let i = 0; i < imageCount; i++) {
        gridGallery.innerHTML += `
            <div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio}">
                <div class="status-container">
                    <div class="spinner"></div>
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <p class="status-text"> Generating...</p>
                </div>
            </div>`;
    }
    generateImages(selectedModel, imageCount, aspectRatio, promptText);

} 

//handle form submission
const handleFormSubmit = (e) => {
    e.preventDefault();
    //get form values 
    const selectedModel = modelSelect.value;
    const imageCount = parseInt(countSelect.value) || 1;
    const aspectRatio = ratioSelect.value || "1/1";
    const promptText = promptInput.value.trim();

    createImageCards(selectedModel, imageCount, aspectRatio, promptText);
};

 //fill prompt inputs with random prompts 
promptBtn.addEventListener("click", () => {
    const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    promptInput.value = prompt;
    promptInput.focus();
})


promptForm.addEventListener("submit", handleFormSubmit);
themeToggle.addEventListener("click", toggleTheme);
