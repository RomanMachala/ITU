{/**
 * 
 * Implementace aplikace Student's scheduler pro predmet ITU - Tvorba uzivatelskych rozhrani 2023/2024
 * @author Machala Roman (xmacha86)
 * 
 * @brief implementace casti TODOListu
 * 
*/}
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function TodoList({navigation}) {
    const [taskItems, setTaskItems] = useState([]);
    /* Funkce ktera nacte z AsyncStorage ulozene ukoly */
    useEffect(() => {
        const loadTaskItems = async () => {
            try {
                const storedTaskItems = await AsyncStorage.getItem('@taskItems');
                if (storedTaskItems !== null) {
                    setTaskItems(JSON.parse(storedTaskItems));
                }
            } catch (e) {
                // Proces chyby pri nacitani dat
            }
        };

        loadTaskItems();
    }, []);
    /* Funkce ktera updatne ulozene ukoly v AsyncStorage */
    useEffect(() => {
        const updateTaskItemsInStorage = async () => {
            try {
                await AsyncStorage.setItem('@taskItems', JSON.stringify(taskItems));
            } catch (e) {
                // Proces chyby pri ukladani dat
            }
        };

        updateTaskItemsInStorage();
    }, [taskItems]); // spusti se pouze tehdy, pokud dojde ke zmene taskItems
    {/* Jednotlive konstanty potrebne pro spravny hod aplikace */}
    const availableColors = ['#EAE7E2', '#D7E2E8', '#B9CBD9', '#FCC9C5', '#CFE3E2']; //Pole barev-pro volbu barvy daneho polozky
    const [selectedColor, setSelectedColor] = useState(availableColors[0]); //konstanta uchovavajici stav aktualne vybrane barvy, implicitne nastavene na prvni barvu v poli
    {/* Konstanty uchovavajici aktualni nazev, prioritu nove vytvarene polozky */}
    const [taskName, setTaskName] = useState('');
    const [taskPrio, setTaskPrio] = useState(0);
    {/* Konstanta uchovavajici zvolenou prioritu pri editaci polozky */}
    const [selectedPriority, setSelectedPriority] = useState(null);
    {/* Konstanty uchovavajici stav pro zobrazeni modalniho okna pro editaci polozky*/}
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    {/* Konstanta uchovavajici informace o editovane polozce */}
    const [editTask, setEditTask] = useState({ name: '', priority: 0, index: -1 });
    {/* Konstanta uchovavajici stav pro zobrazeni modalniho okna pro vkladani polozky */}
    const [modalVisible, setModalVisible] = useState(false);
    const handleOpenModal = () => setModalVisible(true); //Funkce vynucujici zobrazeni modalniho okna pro vkladani polozky
  
    {/**
     * Funkce nasatavujici prioritu nove vkladane polozky dle stuisknuteho tlacitka 
     * @param priority polozky, dle stisknuteho tlacitka
     *  
    */ }
    const handleSelectPriority = (priority) => { 
        setTaskPrio(priority);
        setSelectedPriority(priority);
    };
    {/* Funkce vytvarejici novou polozku */}
    const handleAddTask = () => {
        const newTask = { //nova polozka jiz s nazvemm prioritou a barvou
            name: taskName,
            priority: taskPrio,
            color: selectedColor,
        };
        //Vezme vsechny polozky, ktere zatim existuji, prida k nim nove vytvorenou
        setTaskItems(prevItems => {
            const updatedItems = [...prevItems, newTask];
            return updatedItems.sort((a, b) => b.priority - a.priority); //Metoda sort seradi polozky dle jejich priority od nejvetsi po nejmensi
        });
    
        {/* Zresetujeme jednotlive konstanty */}
        setTaskName(''); 
        setTaskPrio(0);
        setModalVisible(false); //Zavreme modalni okno pro vkladani polozky
        setSelectedPriority(null);
        setSelectedColor(availableColors[0]); //Implicitne nasatvime zvolenou barvu na prvni v poli
    }
    {/**
     * Funkce obstaravajici zobrazeni modalniho okna pro editaci polozky
     * @param item aktualne vybrana polozka
     * @param index index v poli polozek vybrane polozky (slouzi jako unikatni klic)
     * 
    */ }
    const openEditModal = (item, index) => {
        setEditTask({ ...item, index }); //nastavi vybranou polozku jako editovanou
        setIsEditModalVisible(true);
    };
    {/* Funkce spracovavajici editovanou polozku */}
    const handleEditTask = () => {
        const updatedTasks = [...taskItems]; //Vezme vsechny polozky, ktere existuji
        updatedTasks[editTask.index] = { name: editTask.name, priority: taskPrio, color: selectedColor}; //Najde polozku dle indexu a aktualizuje ji
        setTaskItems(updatedTasks); //Nastavi pole s editovanou polozkou jako hlavni pole
        
        setTaskItems(prevItems => { //Preorganizuje jednotlive polozky na zaklade jejich priority
            const updatedItems = [...prevItems]
            return updatedItems.sort((a, b) => b.priority - a.priority);
        });
        //Zresetuje konstanty na vychozi stav
        setTaskPrio(0);
        setSelectedPriority(null);
        setIsEditModalVisible(false);
        setSelectedColor(availableColors[0])
    };
    
   {/* Funkce spracovavajici zavreni modalniho okna pro vkladani polozky */}
    const handleCloseModal = () => {
        setModalVisible(false);
        setTaskPrio(0);
        setTaskName(null); //Tresetuje nazev polozky (pri dalsim otevreni okna by posledni nazev ukolu zustaval)
    }
    {/**
     * Funcke starajici se o spravne odstraenni polozky po jejim dokonceni
     * @param index index dane polozky v poli (jeji unikatni klic)
     * 
    */}
    const completeTask = (index) => {
        let taskItemsCopy = [...taskItems]; //Vezme vsechny polozky
        taskItemsCopy.splice(index, 1); //odstrani polozku na danem indexu
        setTaskItems(taskItemsCopy); //Nastavi modifikovane pole na hlavni
    }
    {/* Funkce generujici tlacitka pro vyber barvy */}
    const renderColorButtons = () => {
        {/* Funkce map projde vsechny polozky pole barev, index je unikatni identifikator dane barvy v poli */}
        return availableColors.map((color, index) => (
            <ColorButton 
                key={index} 
                color={color} 
                onSelectColor={setSelectedColor} //Pri stisknuti tlacitka je zavolana metoda nastavujici vybranou barvu za zvolenou
                isSelected={selectedColor === color} //Pokud je tlacitko zvolene, meni se jeho styl
            />
        ));
    };
    {/**
     *
     * Funkce vracejici samotne tlacitko pro vyber barvy
     * @param color barva daneho tlacitka
     * @param onSelectColor metoda setSelectedColor nastavujici vybranou barvu za zvolenou
     * @param isSelected bool hodnota urcujici zvoleni stylu pro tlacitko barvy
     * 
    */ }
    const ColorButton = ({ color, onSelectColor, isSelected }) => {
        return (
            <TouchableOpacity 
                style={[styles.colorButton, { backgroundColor: color, borderColor: isSelected ? 'grey' : 'transparent' }]} //styl je vybran na zaklade toho, jeli tlacitko vybrano nebo ne
                onPress={() => onSelectColor(color)} //Pri stisknuti je zavolana metoda predana v parametru onSelectColor, ktere se preda vybrana barva parametrem
            />
        );
    };

    {/* Hlavni telo casti TODOListu */}
    return(
    <View style={styles.main}>
            <View style={styles.container}>
            <View style={styles.items}>
    {   //Vyobrazi aktualni polozky nachazejici se v poli
        taskItems.map((item, index) => {
            return ( //Vrati polozku jako TouchableOpacity
                    <TouchableOpacity 
                        key={index} //index je unikatni klic polozky
                        style={[styles.item, {backgroundColor: item.color}]} //barva je predana stylu na zaklade zvolene barvy polozky
                        onPress={() => openEditModal(item, index)}  //Pri stisknuti je zavolana funkce otevirajici editacni modalni okno
                    >
                        <View style={styles.itemBox}>
                            <TouchableOpacity //Oranzovy ctverecek pro dokonceni ukolu
                            style={styles.itemBoxLeft}
                            onPress={() => completeTask(index)} //Pri stisknuti je zavolana funkce odstranujici polozku
                            >

                            </TouchableOpacity>
                            <View>
                                <Text style={styles.itemText}>{item.name}</Text> 
                                {/* Nazev polozky je vyobrazen jako text */}
                            </View>
                        </View>
                    </TouchableOpacity>
            )
            })
    }
            </View>
            </View>
                        {/* Tlacitko pro pridavani nove polozky */}
                        <Pressable style={styles.add} onPress={handleOpenModal}> 
                        {/* Pri stisknuti je zavolana funkce otevirajici modalni okno pro vkladani */}
                            <Text style={styles.plus}>+</Text>
                        </Pressable>
            {/* Modalni okno pro vytvoreni polozky */}
            <Modal taskName={taskName} setTaskName={setTaskName}
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
            <View style={styles.popup}>
                <TextInput //Textovy vstup, pro nazev polozky
                        style={styles.input}
                        placeholder="Task name"
                        value={taskName}
                        onChangeText={setTaskName} //Pri zmene textu je volana funkce, ktera nastavi aktualne vepsany text na jmeno pridavane polozky
                    />
                <View style={styles.priorityButtons}> 
                {/* Tlacitka pro vyber priority daneho ukolu */}
                        <TouchableOpacity 
                        style={[styles.priority, selectedPriority === 1 ? styles.selected : null]} //Pokud je tlacitko stisknute meni se jeho styl
                        onPress={() => handleSelectPriority(1)} //Pri stisknuti se vola funkce nastavujici prioritu ukolu dle vybraneho tlacitka
                        >
                            <Text style={styles.prioText}>
                                1
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        style={[styles.priority, selectedPriority === 2 ? styles.selected : null]} 
                        onPress={() => handleSelectPriority(2)}
                        >
                            <Text style={styles.prioText}>
                                2
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        style={[styles.priority, selectedPriority === 3 ? styles.selected : null]} 
                        onPress={() => handleSelectPriority(3)}
                        >
                            <Text style={styles.prioText}>
                                3
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        style={[styles.priority, selectedPriority === 4 ? styles.selected : null]} 
                        onPress={() => handleSelectPriority(4)}
                        >
                            <Text style={styles.prioText}>
                                4
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        style={[styles.priority, selectedPriority === 5 ? styles.selected : null]} 
                        onPress={() => handleSelectPriority(5)}
                        >
                            <Text style={styles.prioText}>
                                5
                            </Text>
                        </TouchableOpacity>
                </View>
                <View style={styles.colorButtonContainer}>
                    {renderColorButtons()} 
                    {/* Generace tlacitek pro vyber barvy */}
                </View>
                <View style={styles.buttons}> 
                {/* Tlacitka pro vlozeni ukolu nebo zahozeni provedenych zmen */}
                    <TouchableOpacity style={styles.doneBox} onPress={handleAddTask}> 
                    {/* Tlacitko confirm, pri stisku je volana funkce pridavajici polozku do pole */}
                        <View>
                            <Text style={styles.doneText}>
                                Confirm
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBox}>
                        <View>
                            <Text style={styles.cancelText} onPress={handleCloseModal}>
                                {/* Tlacitko Cancel, pri stisknuti volana funkce zavirajici modalni okno a zahozeni vsech provedenych zmen */}
                                Cancel
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>     
            </View>

            </Modal>{/* Konec prostredi modal pro vkladani nove polozky */}

            <Modal /* Zacatek prostredi modal pro editaci vybrane polozky */
            visible={isEditModalVisible}
            animationType="slide"
            onRequestClose={() => setIsEditModalVisible(false)}
            transparent={true}
            >
                <View style={styles.editTodo}>
                    <TextInput //Textovy vstup, ve kterem je implicitne nastaveno jmeno polozky, ktere muze uzivatel zmenit
                        style={styles.editInput}
                        onChangeText={(text) => setEditTask(prev => ({ ...prev, name: text }))} //Pri zmene textu se vola funkce menici nazev polozky
                        value={editTask.name} //implicitni hodnota
                    />
                    <View style={styles.priorityButtonsEdit}>
                    <TouchableOpacity //Tlacitka pro vyber priority
                        style={[styles.priority, selectedPriority === 1 ? styles.selected : null]} //Pokud je tlacitko stisknute meni se jeho styl
                        onPress={() => handleSelectPriority(1)}//Pri stisknuti se vola funkce nastavujici prioritu ukolu dle vybraneho tlacitka
                    >
                        <Text style={styles.prioText}>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.priority, selectedPriority === 2 ? styles.selected : null]} 
                        onPress={() => handleSelectPriority(2)}
                    >
                        <Text style={styles.prioText}>2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.priority, selectedPriority === 3 ? styles.selected : null]} 
                        onPress={() => handleSelectPriority(3)}
                    >
                        <Text style={styles.prioText}>3</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.priority, selectedPriority === 4 ? styles.selected : null]} 
                        onPress={() => handleSelectPriority(4)}
                    >
                        <Text style={styles.prioText}>4</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.priority, selectedPriority === 5 ? styles.selected : null]} 
                        onPress={() => handleSelectPriority(5)}
                    >
                        <Text style={styles.prioText}>5</Text>
                    </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.editConfirm} onPress={handleEditTask}>
                        <Text style={styles.editText}>
                            Save
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.collorButtonContainerEdit}>
                    {renderColorButtons()} 
                    {/* Genreace tlacitek pro vyber barvy */}
                    </View>
                </View>
                
            </Modal>

        
    </View>
    );
}

{/* Jednotlive styly pro casti aplikace */}
const styles = StyleSheet.create({
    main: { //Hlavni telo
        backgroundColor: '#FAEED1',
        height: 900,
    },
    container: { //Magicky styl bez ktereho to nefunguje
    },
    items: { //Polozky
        paddingHorizontal: 20,
    },
    add: { //Tlacitko pro pridani polozky
        position: 'absolute',
        marginTop: 670,
        justifyContent: 'center',
        alignSelf: 'flex-end',
        paddingRight: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        width: 70,
        height: 70,
        borderRadius: 70,
    },
    plus: { //Plus uvnitr tlactika pro pridani polozky
        fontSize: 24,
        fontWeight: 'bold',
        position: 'absolute',
        paddingLeft: 28,
    },
    popup: { //Vyskakovaci modalni okno pro vkladani polozky
        position: 'absolute',
        width: 370,
        left: 12,
        height: 400,
        top: 130,
        backgroundColor: 'rgba(240, 219, 175, 0.8)',
        borderRadius: 10,
    },
    input: { //Textvy vstup pro nazev polozky
        borderWidth: 1,
        borderColor: 'grey',
        fontSize: 24,
        alignSelf: 'center',
        backgroundColor: 'white',
        width: 250,
        height: 70,
        top: 40,
        borderRadius: 10,
    },
   buttons: { //Tlacitka pro ulozeni/zruseni
        position: 'absolute',
        flexDirection: 'row',
        alignSelf: 'center',
        bottom: 40,
        justifyContent: 'space-between',
   },
   doneBox: { //Confirm tlacitko
    width: 120,
    height: 50,
    backgroundColor: '#304D30',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 1,
   },
   cancelBox: { //Cancel tlacitko
    width: 120,
    height: 50,
    backgroundColor: '#BE3144',
    marginLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 1,
   },
   doneText: { //Text pro Confrim tlacitko
    fontSize: 24,
   },
   cancelText: { //Text pro Cancel tlacitko
    fontSize: 24,
   },
   item: { //Jedna polozka
    marginTop: 10,
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    height: 75,
    borderColor: 'grey',
    borderWidth: 1,
    },
    itemBox: { //Uzavreni polozky do boxu
        flexDirection: 'row',
        allignItems: 'center',
        flexWrap: 'wrap',
    },
    itemBoxLeft: { //Tlacitko pro dokonceni ukolu
        width: 35,
        height: 35,
        borderRadius: 10,
        backgroundColor: '#F2D59B',
        marginRight: 15,
    },
    itemText: { //Nazev ukolu
        fontSize: 20,
        paddingHorizontal: 20,
    },
    priorityButtons: { //Tlacitka pro prioritu
        flexDirection: 'row',
        alignSelf: 'center',
        marginLeft: 'auto',
        top: 100,
    },
    priority: { //jedno tlacitko
        marginRight: 20,
        width: 50,
        height: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 10,
    },
    selected: { //Vybrane tlacitko priority
        backgroundColor: 'grey',
    },
    prioText: { //Text pro tlacitko priority
        alignSelf: 'center',
        fontSize: 24,
    },
    editTodo: { //Modalni okno pro editaci ukolu
        width: 370,
        left: 12,
        height: 350,
        marginTop: 'auto',
        marginBottom: 'auto',
        backgroundColor: 'rgba(242, 213, 155, 0.7)',
        borderRadius: 10,

    },
    editInput: { //Textovy vstup pro editaci ukolu
        backgroundColor: 'white',
        alignSelf: 'center',
        position: 'absolute',
        top: 30,
        width: 200,
        height: 70,
        borderRadius: 10,
    },
    editConfirm: { //Tlacitko Confirm pro editaci
        backgroundColor: '#304D30',
        position: 'absolute',
        width: 100,
        height: 60,
        alignSelf: 'center',
        bottom: 20,
        borderRadius: 10,
    },
    editText: { //text pro t lacitko confirm pro editaci
        alignSelf: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
        fontSize: 24,
    },
    priorityButtonsEdit: { //Tlacitka pro prioritu u editace
        flexDirection: 'row',
        alignSelf: 'center',
        marginLeft: 'auto',
        top: 130,
    },
    colorButtonContainer: { //Container pro tlacitka pro vber barvy
        flexDirection: 'row',
        top: 120,
        alignSelf: 'center',
    },
    colorButton: { //Jedno tlacitko barvy
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 5,
        borderWidth: 1,
    },
    collorButtonContainerEdit: { //Container pro tlacitka pro vyber barvy u editace
        flexDirection: 'row',
        top: 140,
        alignSelf: 'center',
    }
});
