class Animal {
    constructor(name, image, type, bread, age, sex, neededAmount, currentlyRisedAmount) {
        this.name = name;
        this.image = image;
        this.type = type;
        this.bread = bread;
        this.age = age;
        this.sex = sex;
        this.neededAmount = neededAmount;
        this.currentlyRisedAmount = currentlyRisedAmount;

    }
}
class AnimalManager {
    constructor() {
        this.allAnimalsList = [];
        this.loadAdoptedListFromStorage();
        this.donatedList = [];
        this.typeList = [];

        DATA.forEach(animalData => {
            let animal = new Animal(
                this.name = animalData.name,
                this.image = animalData.image,
                this.type = animalData.type,
                this.bread = animalData.bread,
                this.age = animalData.age,
                this.sex = animalData.sex,
                this.neededAmount = animalData.neededAmount,
                this.currentlyRisedAmount = animalData.currentlyRisedAmount
            )

            if (!this.isInadoptedList(animal) && this.allAnimalsList.indexOf(animal) === -1) {
                this.allAnimalsList.push(animal);
            }
        })

        this.allAnimalsList.forEach(a => {
            this.typeList.push(a.type);
        })
        this.typeList = Array.from(new Set(this.typeList));
    }

    loadAdoptedListFromStorage() {
        const storedAdoptedList = JSON.parse(localStorage.getItem('adoptedList'));
        if (storedAdoptedList) {
            this.adoptedList = storedAdoptedList.map(animalData => new Animal(
                animalData.name,
                animalData.image,
                animalData.type,
                animalData.bread,
                animalData.age,
                animalData.sex,
                animalData.neededAmount,
                animalData.currentlyRisedAmount
            ));
        } else {
            this.adoptedList = [];
        }
    }

    saveAdoptedListToStorage() {
        localStorage.setItem('adoptedList', JSON.stringify(this.adoptedList));
    }

    adopt = (animal) => {
        let idx = this.allAnimalsList.indexOf(animal);
        if (idx !== -1) {
            this.allAnimalsList.splice(idx, 1);
        }

        if (this.adoptedList.indexOf(animal) === -1) {
            this.adoptedList.push(animal);
            this.saveAdoptedListToStorage();
        }
    }

    leave = (animal) => {
        let idx = this.adoptedList.indexOf(animal);
        if (idx !== -1) {
            this.adoptedList.splice(idx, 1);
            this.saveAdoptedListToStorage();
            this.allAnimalsList.push(animal);
        }
    }

    isInadoptedList = (animal) => {
        return this.adoptedList.indexOf(animal) !== -1;
    }

    donate = (animal) => {
        if (this.donatedList.indexOf(animal) === -1) {
            this.donatedList.push(animal);
        }
    }

    search = (animal) => {
        return this.allAnimalsList.filter(item => {
            return item.name.toLowerCase().includes(animal.toLowerCase().trim());
        });
    }

    searchByType = (typezz) => {
        return this.allAnimalsList.filter(item => {
            return item.type.toLowerCase().includes(typezz.toLowerCase().trim());
        })
    }
}


