import React, { useState } from 'react';
import './App.css';

//Zutaten
const initialIngredients = {
  Grundnahrungsmittel: ['Kartoffeln', 'Reis', 'Nudeln', 'Brot', 'Quinoa', 'Haferflocken', 'Couscous', 'Polenta', 'Bulgur', 'Mais'],
  Gemüse: ['Tomaten', 'Zucchini', 'Karotten', 'Brokkoli', 'Spinat', 'Paprika', 'Aubergine', 'Kürbis', 'Lauch', 'Gurken'],
  Obst: ['Apfel', 'Banane', 'Orange', 'Trauben', 'Kiwi', 'Mango', 'Ananas', 'Beeren', 'Pfirsich', 'Melone'],
  'Milchprodukte und Eier': ['Milch', 'Joghurt', 'Käse', 'Butter', 'Eier', 'Sahne', 'Quark', 'Frischkäse', 'Joghurt', 'Schmand'],
  Fleisch: ['Poulet', 'Rind', 'Schwein', 'Lamm', 'Reh', 'Hackfleisch', 'Wurst', 'Ente', 'Fisch', 'Lachs'],
  Fleischersatzprodukte: ['Tofu', 'Seitan', 'Tempeh', 'Sojaschnitzel', 'Lupinensteak', 'Jackfruit', 'Linsenbällchen', 'Beyond Burger', 'Grünkern', 'Erbsenprotein'],
  Dessert: ['Schokoladeeis', 'Vanillaeis', 'Kuchen', 'Pudding', 'Tiramisu', 'Muffins', 'Fruchtsalat', 'Creme brulee', 'Panna Cotta', 'Soufflé']
};

function App() {
  const [mixedIngredients, setMixedIngredients] = useState([]);
  const [randomDishName, setRandomDishName] = useState('');
  const [preparationMethod, setPreparationMethod] = useState('');
  const [rating, setRating] = useState(0);

  const mixIngredients = () => {
    const mixed = [];
    let totalIngredientsCount = 0;
    const selectedIngredients = {};

    // random Auswahl von 5 bis 10 Zutaten
    Object.values(initialIngredients).forEach(categoryIngredients => {
      const count = Math.floor(Math.random() * 6) + 5; // random Anzahl von 5 bis 10
      totalIngredientsCount += count;

      for (let i = 0; i < count; i++) {
        let randomIngredient;
        do {
          randomIngredient = categoryIngredients[Math.floor(Math.random() * categoryIngredients.length)];
        } while (selectedIngredients[randomIngredient]);

        selectedIngredients[randomIngredient] = true;
        mixed.push(randomIngredient);
      }
    });

    // Sicherstellen, dass die Gesamtanzahl zwischen 5 und 10 liegt
    if (totalIngredientsCount > 10) {
      mixed.splice(10);
    }

    // random Zubereitungsmethode auswählen (optional)
    const preparationMethods = ['kochen', 'garen', 'frittieren', 'roh'];
    const randomPreparationMethod = preparationMethods[Math.floor(Math.random() * preparationMethods.length)];
    setPreparationMethod(randomPreparationMethod);

    // random Name für das Gericht gemess regeln
    const dishName = createRandomDishName(mixed);
    setMixedIngredients(mixed);
    setRandomDishName(dishName);
  };

  const createRandomDishName = (ingredients) => {
    let dishName = '';

    ingredients.forEach((ingredient, index) => {
      // Index für die Zeichen im Zutatennamen
      const charIndex1 = index * 2 % ingredient.length;
      const charIndex2 = (index * 2 + 1) % ingredient.length;

      // Hinzufügen der ausgewählten Zeichen zum Gerichtsnamen (2,4,6,8)
      dishName += ingredient.charAt(charIndex1) + ingredient.charAt(charIndex2);
    });

    return dishName;
  };

  const resetIngredients = () => {
    setMixedIngredients([]);
    setRandomDishName('');
    setPreparationMethod('');
    setRating(0);
  };

  // bewertung der Gerichte
  const rateDish = () => {
    let stars = 0;

    // Kriterien für bewertung überprüfen
    if (mixedIngredients.filter(ingredient => initialIngredients.Gemüse.includes(ingredient)).length >= 2 && mixedIngredients.filter(ingredient => initialIngredients.Gemüse.includes(ingredient)).length <= 4) {
      stars++;
    }
    if (mixedIngredients.filter(ingredient => initialIngredients.Obst.includes(ingredient)).length >= 1 && mixedIngredients.filter(ingredient => initialIngredients.Obst.includes(ingredient)).length <= 2) {
      stars++;
    }
    if (mixedIngredients.some(ingredient => initialIngredients.Fleisch.includes(ingredient)) || mixedIngredients.some(ingredient => initialIngredients.Fleischersatzprodukte.includes(ingredient))) {
      stars++;
    }

    if (mixedIngredients.some(ingredient => initialIngredients.Grundnahrungsmittel.includes(ingredient))) {
      stars++;
    }
    const dairyEggCount = mixedIngredients.filter(ingredient => initialIngredients['Milchprodukte und Eier'].includes(ingredient)).length;
    if (dairyEggCount === 0 || dairyEggCount === 1) {
      stars++;
    }

    // Abzug von Sternen basierend auf Zubereitungsart
    if (preparationMethod === 'roh' && (mixedIngredients.some(ingredient => initialIngredients.Fleisch.includes(ingredient)) || mixedIngredients.some(ingredient => initialIngredients.Fleischersatzprodukte.includes(ingredient)))) {
      stars--;
    }

    setRating(stars);
  };

  //HTML
  
  return (
    <div className="App">
      <header>
        <h1>Random Koch</h1>
        <p>Klicke auf den Button, um ein zufälliges Gericht zu generieren.</p>
      </header>
      <div className="content">
        {/* Button zum Mischen der Zutaten */}
        <button onClick={mixIngredients}>Zutaten mischen</button>

        {/* Zurücksetzen-Button */}
        <button className="reset-btn" onClick={resetIngredients}>Zurücksetzen</button>

        {/* Zubereitungsart */}
        <div>
          <label htmlFor="preparation-method">Zubereitungsart:</label>
          <select id="preparation-method" value={preparationMethod} onChange={(e) => setPreparationMethod(e.target.value)}>
            <option value="">Bitte wählen</option>
            <option value="kochen">Kochen</option>
            <option value="garen">Garen</option>
            <option value="frittieren">Frittieren</option>
            <option value="roh">Roh</option>
          </select>
        </div>

        {/* Bewertung-Button */}
        <button className="rate-btn" onClick={rateDish}>Gericht bewerten</button>

        {/* Anzeige der Bewertung */}
        {rating > 0 && (
          <div id="rating">
            <h2>Bewertung</h2>
            <p>{'★'.repeat(rating)}</p>
          </div>
        )}

        {/* Anzeige der gemischten Zutaten und des Gerichtsnamens */}
        {mixedIngredients.length > 0 && (
          <div id="result">
            <h2>Gemischte Zutaten</h2>
            <ul>
              {mixedIngredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h2>Gericht</h2>
            <p>Name: {randomDishName}</p>
          </div>
        )}

        {/* Liste der Zutaten pro Kategorie */}
        <table id="ingredients-list">
          <thead>
            <tr>
              <th>Kategorie</th>
              <th>Zutaten</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(initialIngredients).map(([category, items]) => (
              <tr key={category}>
                <td>{category}</td>
                <td>{items.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
