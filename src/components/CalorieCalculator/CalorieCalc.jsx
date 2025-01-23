import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';

const CalorieCalc = () => {
    const [formData, setFormData] = useState({
        targetWeight: '',
        startDate: '',
        endDate: '',
    });
    const [macroForm, setMacroForm] = useState({
        fat: '',
        protein: '',
        carbohydrates: '',
        type: 'maintenance',
    });
    const [calorieMaintenance, setCalorieMaintenance] = useState(null);
    const [dailyCalories, setDailyCalories] = useState(null);
    const [macroGrams, setMacroGrams] = useState({
        fatGrams: null,
        proteinGrams: null,
        carbGrams: null,
    });
    const [error, setError] = useState('');
    const email = localStorage.getItem('email');

    useEffect(() => {
        const fetchCaloricMaintenance = async () => {
            try {
                const res = await axios.get(`${baseURL}api/calc/calculate/${email}`);
                const maintenanceValue = parseFloat(res.data.calorie_Maintenance).toFixed(2);
                setCalorieMaintenance(maintenanceValue);
            } catch (err) {
                setError('Please initialize your profile prior to calculating your Caloric Intake.');
                setCalorieMaintenance(null);
            }
        };

        fetchCaloricMaintenance();
    }, [email]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMacroChange = (e) => {
        setMacroForm({ ...macroForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`${baseURL}api/calc/calculate-DC/${email}`, {
                params: formData,
            });
            const dailyCaloriesValue = parseFloat(res.data.dailyCalories).toFixed(2);
            setDailyCalories(dailyCaloriesValue);
            setError('');
        } catch (err) {
            setError('Error calculating daily calories. Please check your input and try again.');
            setDailyCalories(null);
        }
    };

    const handleStoreCaloricValue = async (type) => {
        try {
            const caloricValue = type === 'maintenance' ? calorieMaintenance : dailyCalories;
            await axios.post(`${baseURL}api/calc/store-caloric-value`, {
                email,
                [type === 'maintenance' ? 'caloricMaintenance' : 'dailyCalories']: caloricValue,
            });
            localStorage.setItem('dailyCalories', caloricValue);
            console.log('Caloric value stored successfully!');
        } catch (err) {
            setError('Error storing caloric value. Please try again later.');
        }
    };

    const handleCalculateMacros = async (e) => {
        e.preventDefault();
        const totalPercentage = parseFloat(macroForm.fat) + parseFloat(macroForm.protein) + parseFloat(macroForm.carbohydrates);
        if (totalPercentage !== 100) {
            setError('The total macronutrient percentages must equal 100%.');
            return;
        }

        try {
            const res = await axios.get(`${baseURL}api/calc/calculate-macros/${email}`, {
                params: {
                    ...macroForm,
                    fat: parseFloat(macroForm.fat),
                    protein: parseFloat(macroForm.protein),
                    carbohydrates: parseFloat(macroForm.carbohydrates),
                },
            });
            const macros = {
                fatGrams: res.data.fatGrams.toFixed(2),
                proteinGrams: res.data.proteinGrams.toFixed(2),
                carbGrams: res.data.carbGrams.toFixed(2),
            };
            setMacroGrams(macros);
            localStorage.setItem("MacroGrams", JSON.stringify(macros));
            setError('');
        } catch (err) {
            setError('Error calculating macronutrient grams. Please check your input and try again.');
            setMacroGrams({
                fatGrams: null,
                proteinGrams: null,
                carbGrams: null,
            });
        }
    };

    const handleStoreMacros = async () => {
        try {
            await axios.post(`${baseURL}api/calc/store-macros/${email}`, macroGrams);
            localStorage.setItem("MacroGrams", JSON.stringify(macroGrams));
            console.log('Macros stored successfully!');
        } catch (err) {
            setError('Error storing macronutrient values. Please try again later.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-5 border border-gray-300 rounded-lg">
            <h1 className="text-lg font-bold mb-6">Daily Caloric Calculator</h1>
            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="targetWeight" className="block font-medium">Target Weight (kg)</label>
                        <input
                            type="number"
                            name="targetWeight"
                            value={formData.targetWeight}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block font-medium">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block font-medium">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Calculate Daily Calories
                        </button>
                    </div>
                </div>
            </form>
            {calorieMaintenance !== null && (
                <div className="mt-6 p-4 border rounded">
                    <p><strong>Caloric Maintenance:</strong> {calorieMaintenance} calories/day</p>
                    <div className="flex justify-center">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2" onClick={() => handleStoreCaloricValue('maintenance')}>
                            Store Caloric Maintenance
                        </button>
                    </div>
                </div>
            )}
            {dailyCalories !== null && (
                <div className="mt-6 p-4 border rounded">
                    <p><strong>Daily Caloric Intake to Reach Goal:</strong> {dailyCalories} calories/day</p>
                    <div className="flex justify-center">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2" onClick={() => handleStoreCaloricValue('daily')}>
                            Store Daily Caloric Intake
                        </button>
                    </div>
                </div>
            )}
            <div className="mt-8">
                <h2 className="text-md font-bold mb-4">Adjust Macronutrient Ratios</h2>
                <form onSubmit={handleCalculateMacros}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="macroType" className="block font-medium">Caloric Value Type</label>
                            <select
                                name="type"
                                value={macroForm.type}
                                onChange={handleMacroChange}
                                className="w-full px-3 py-2 border rounded"
                            >
                                <option value="maintenance">Caloric Maintenance</option>
                                <option value="daily">Daily Caloric Intake</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="fat" className="block font-medium">Fat (%)</label>
                            <input
                                type="number"
                                name="fat"
                                value={macroForm.fat}
                                onChange={handleMacroChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="protein" className="block font-medium">Protein (%)</label>
                            <input
                                type="number"
                                name="protein"
                                value={macroForm.protein}
                                onChange={handleMacroChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="carbohydrates" className="block font-medium">Carbohydrates (%)</label>
                            <input
                                type="number"
                                name="carbohydrates"
                                value={macroForm.carbohydrates}
                                onChange={handleMacroChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div className="flex justify-center">
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Calculate Macronutrient Grams
                            </button>
                        </div>
                    </div>
                </form>
                {macroGrams.fatGrams !== null && (
                    <div className="mt-6 p-4 border rounded">
                        <p><strong>Fat:</strong> {macroGrams.fatGrams} grams/day</p>
                        <p><strong>Protein:</strong> {macroGrams.proteinGrams} grams/day</p>
                        <p><strong>Carbohydrates:</strong> {macroGrams.carbGrams} grams/day</p>
                        <div className="flex justify-center">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2" onClick={handleStoreMacros}>
                                Store Macros
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalorieCalc;
