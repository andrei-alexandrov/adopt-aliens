class ViewController {
    constructor() {
        window.addEventListener("hashchange", this.handleHashChange);
        window.addEventListener("load", this.handleHashChange);

        this.animalManager = new AnimalManager();
    }

    handleHashChange = () => {
        let pageIds = ["login", "register", "home", "adopted", "donated"];
        let hash = window.location.hash.slice(1) || pageIds[0];

        if (hash === "home") {
            if (!userManager.loggedUser) {
                location.hash = "login";
                return;
            }
        }

        if (hash === "adopted") {
            if (!userManager.loggedUser) {
                location.hash = "login";
                return;
            }
        }

        pageIds.forEach(id => {
            let page = document.getElementById(id);
            if (id === hash) {
                if (id === "login") {
                    page.style.display = "flex";
                } else if (id === "home") {
                    page.style.display = "block";
                } else if (id === "adopted") {
                    page.style.display = "block";
                } else if (id === "register") {
                    page.style.display = "flex";
                } else if (id === "donated") {
                    page.style.display = "flex";
                }
            } else {
                page.style.display = "none";
            }
        })

        switch (hash) {
            case "login":
                this.renderLoginPage();
                break;
            case "register":
                this.validateRegister();
                this.renderRegister();
                break;
            case "home":
                this.renderHomePage();
                break;
            case "adopted":
                this.renderAdoptedPage();
                break;
        }
    }

    adoptedCounter = () => {
        let counterContainer = document.querySelector("#dot .dotInnerContainer");
        counterContainer.innerHTML = "";

        let sackHappy = createElement("img");
        sackHappy.classList.add("sackMedidate");
        sackHappy.src = "./assets/pics/sackHappy1.gif"

        let sackSad = createElement("img");
        sackSad.classList.add("sackMedidate");
        sackSad.src = "./assets/pics/sackMeditate1.gif";

        let counter = createElement("span");
        counter.classList.add("dotContent");
        counter.innerText = this.animalManager.adoptedList.length;

        if (this.animalManager.adoptedList.length === 0) {
            counterContainer.append(sackSad, counter);
        } else {
            counterContainer.append(sackHappy, counter);
        }
    }

    renderLoginPage = () => {
        let errorMessage = document.getElementById("loginError");
        let form = document.getElementById("loginForm");

        form.onsubmit = (e) => {
            e.preventDefault();
            let username = e.target.elements.username.value;
            let pass = e.target.elements.pass.value;
            let successfulLogin = userManager.login({ username, pass });

            if (successfulLogin) {
                location.hash = "home";
            } else {
                errorMessage.innerText = "Wrong alien credentials. Try again.";
            }
        }
    }

    validateRegister = () => {
        let registerError = document.getElementById('registerError');
        let username = document.getElementById('username').value;
        let pass = document.getElementById('pass').value;
        let confirmPass = document.getElementById('confirmPass').value;

        if (!username || !pass || !confirmPass) {
            return false;
        }

        if (pass !== confirmPass) {
            registerError.innerText = 'Password and confirm password do not match.';
            registerError.style.display = "block";
            return false;
        }

        if (pass.length < 6 || !/[!@#$%^&*(),.?":{}|<>]/.test(pass) || !/[a-z]/.test(pass) || !/[A-Z]/.test(pass)) {
            registerError.innerText = 'Password must be at least 6 characters long and contain at least one special character, one lowercase letter, and one uppercase letter.';
            registerError.style.display = "block";
            return false;
        }

        registerError.style.display = "none";
        return true;
    };

    renderRegister = () => {
        let registerForm = document.getElementById("registerForm");
        let registerMessage = document.getElementById("registerMessage");
        let registerError = document.getElementById("registerError");

        document.getElementById('username').addEventListener('input', () => {
            this.validateRegister();
        });

        document.getElementById('pass').addEventListener('input', () => {
            this.validateRegister();
        });

        document.getElementById('confirmPass').addEventListener('input', () => {
            this.validateRegister();
        });

        registerForm.onsubmit = (e) => {
            e.preventDefault();
            if (this.validateRegister()) {
                let username = document.getElementById('username').value;
                let pass = document.getElementById('pass').value;
                const isRegistered = userManager.register({ username, pass });

                if (isRegistered) {
                    registerMessage.innerText = "Registration successful!";
                    registerMessage.style.color = "green";
                    registerMessage.style.display = "flex";
                    registerMessage.style.justifyContent = "center";

                    setTimeout(() => {
                        registerMessage.style.display = "none";
                        location.hash = "login";
                    }, 2000);
                } else {
                    registerError.innerText = "Username is already taken. Please choose another username.";
                    registerError.style.display = "block";
                }
            };
        };
        registerForm.reset();
    };

    renderAnimals = (animal, container) => {
        container.innerHTML = "";

        animal.forEach(obj => {

            let card = createElement("div");
            card.classList.add("card")

            let image = createElement("img");
            image.src = obj.image;
            image.classList.add("image");

            let divWrapper = createElement("div");
            divWrapper.classList.add("divWrapper");

            let name = createElement("h3");
            name.id = "nameDiff";
            name.innerText = "Име: " + obj.name;

            let type = createElement("div");
            type.classList.add("type");
            type.innerText = "Тип: " + obj.type;

            let bread = createElement("div");
            bread.classList.add("bread");
            bread.innerHTML = "Порода: " + obj.bread;

            let age = createElement("div");
            age.classList.add("age");
            age.innerHTML = "Години: " + obj.age;

            let sex = createElement("div");
            sex.classList.add("sex");
            sex.innerHTML = "Пол: " + obj.sex;

            let neededAmount = createElement("div");
            neededAmount.classList.add("neededAmount");
            if (this.animalManager.isInadoptedList(obj)) {
                neededAmount.style.color = "yellow";
                neededAmount.innerHTML = "Осиновен на: " + new Date().toLocaleDateString() + " в " + new Date().toLocaleTimeString();

            } else {
                neededAmount.innerHTML = "Нужна сума: " + obj.neededAmount + " лв.";
            }

            let currentlyRisedAmount = createElement("div");
            currentlyRisedAmount.classList.add("currentlyRisedAmount");
            currentlyRisedAmount.innerHTML = "Събрана сума: " + obj.currentlyRisedAmount + " лв.";

            let adoptBtn = createElement("button");
            if (this.animalManager.isInadoptedList(obj)) {
                adoptBtn.classList.add("adoptBtn");
                card.classList.add("liked")
                adoptBtn.innerText = "Leave";
                adoptBtn.addEventListener("click", () => {
                    this.animalManager.leave(obj);
                    this.handleHashChange();
                    this.adoptedCounter();
                });
            } else {
                adoptBtn.classList.add("adoptBtn");
                adoptBtn.innerText = "Adopt";
                adoptBtn.addEventListener("click", () => {
                    this.animalManager.adopt(obj);
                    this.handleHashChange();
                    this.adoptedCounter();
                });
            }

            let donateBtn = createElement("button");
            donateBtn.classList.add("donateBtn");
            donateBtn.innerText = "Donate";

            if (Number(obj.neededAmount) === Number(obj.currentlyRisedAmount)) {
                donateBtn.style.display = "none";
            }

            donateBtn.addEventListener("click", () => {
                this.animalManager.donate(obj);
                location.hash = "donated";

                let donationMessage = document.getElementById("donationMessage");
                donationMessage.innerHTML = "How much do you want to donate for " + obj.name + "?";

                let donationSumButton = document.getElementById("donateSumButton");
                donationSumButton.onclick = (e) => {
                    e.preventDefault();

                    let amount = 0;
                    let amountInput = document.getElementById("donationAmount");
                    amount = Number(amountInput.value);

                    let getNameInput = document.getElementById("donatorName");
                    let donatorName = getNameInput.value;

                    if (!donatorName) {
                        alert("Please enter your name.");
                        return;
                    }
                    if (!amount) {
                        alert("Please enter a donation amount (in leva).");
                        return;
                    }

                    if (amount > obj.neededAmount - obj.currentlyRisedAmount) {
                        alert(`The donation amount you are about to make is higher than the needed sum. Only
                        ${obj.neededAmount - obj.currentlyRisedAmount} leva will be taken.`);

                        amount = obj.neededAmount - obj.currentlyRisedAmount;
                        obj.currentlyRisedAmount = obj.currentlyRisedAmount + amount;
                        if (obj.currentlyRisedAmount >= obj.neededAmount) {
                            alert("Sum goal achieved!")
                        }
                    } else {
                        obj.currentlyRisedAmount = obj.currentlyRisedAmount + amount;
                        if (obj.currentlyRisedAmount >= obj.neededAmount) {
                            alert("Sum goal achieved!")
                        }
                    }

                    let table = document.getElementById("donationsHistory");
                    let newRow = table.insertRow();
                    let dateCell = newRow.insertCell();
                    let animalCell = newRow.insertCell();
                    let amountCell = newRow.insertCell();

                    dateCell.textContent = new Date().toLocaleDateString();
                    animalCell.textContent = obj.name;
                    amountCell.textContent = amount;

                    amountInput.value = ""; //Иначе конкатенира всеки следващ инпут към предишния от юзера при donations
                }
            })

            if (this.animalManager.isInadoptedList(obj)) {
                donateBtn.style.display = "none";
            }

            if (!this.animalManager.isInadoptedList(obj)) {
                card.classList.add("neutral");
            }

            if (obj.name.includes("Slavozar Vargulev")) {
                adoptBtn.style.display = "none";
                donateBtn.style.display = "none";
                neededAmount.style.display = "none";
                currentlyRisedAmount.innerText = "Cannot be adopted";
                currentlyRisedAmount.classList.add("cannotAdopt");
            }
            divWrapper.append(name, type, bread, age, sex, neededAmount, currentlyRisedAmount);
            card.append(image, divWrapper, adoptBtn, donateBtn);
            container.append(card);
        })

    }

    renderSelectMenu = (animalTypes) => {
        let selectElement = document.getElementById("animalsFilter");
        animalTypes.forEach(item => {
            let option = createElement("option");
            option.innerText = item;
            selectElement.appendChild(option);
        })
    }

    renderHomePage = () => {
        let homeContainer = document.querySelector("#home .container");
        this.renderAnimals(this.animalManager.allAnimalsList, homeContainer);

        let getInput = document.getElementById("searchInput");
        getInput.addEventListener("input", (event) => {
            let result = this.animalManager.search(event.target.value);
            this.renderAnimals(result, homeContainer);
        });

        this.renderSelectMenu(this.animalManager.typeList);

        let getSelect = document.getElementById("animalsFilter");
        getSelect.addEventListener("change", (event) => {
            let resultSelect = this.animalManager.searchByType(event.target.value);
            this.renderAnimals(resultSelect, homeContainer);
        })

        let redirectRegister = document.querySelector("#login .registerRedirect");
        redirectRegister.addEventListener("click", () => {
            location.hash = "register";
        })
    }

    renderAdoptedPage = () => {
        let homeContainer = document.querySelector("#adopted .container");
        this.renderAnimals(this.animalManager.adoptedList, homeContainer);
    }
}

let viewControler = new ViewController();