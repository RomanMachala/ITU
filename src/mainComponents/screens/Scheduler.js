{/**
 * 
 * Implementace aplikace Student's scheduler pro predmet ITU - Tvorba uzivatelskych rozhrani 2023/2024
 * @author Machala Roman (xmacha86)
 * 
 * @brief implementace casti Scheduler
 * 
*/}

//Import jednotlivych knihoven
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Hlavni cast scheduleru
export default function Scheduler({navigation}) {
    {/* Deklarace potrebnych konstant a operaci nad nimi */}
    {/* Konstanta ze ktere se ukladaji data do AsyncStorage */}
    const [schedule, setSchedule] = useState({
        'Mo': [],
        'Tu': [],
        'We': [],
        'Th': [],
        'Fr': []
    });
    {/* Funkce, ktera nacte polozky z AsyncStorage pri spusteni aplikace*/}
    useEffect(() => {
        const loadSchedule = async () => {
            try {
                const storedSchedule = await AsyncStorage.getItem('@schedule');
                if (storedSchedule !== null) {
                    setSchedule(JSON.parse(storedSchedule));
                }
            } catch (e) {
                // Proces chyby pri ukladani dat
            }
        };
    
        loadSchedule();
    }, []);
    {/* Funkce, ktera ulozi polozky do AsyncStorage pouze pri zmene constanty schedule */}
    useEffect(() => {
        const updateScheduleInStorage = async () => {
            try {
                await AsyncStorage.setItem('@schedule', JSON.stringify(schedule));
            } catch (e) {
                // Proces chyby pri ukladani dat
            }
        };
    
        updateScheduleInStorage();
    }, [schedule]);
    {/* Pole barev pro moznost vyberu barvy polozky */}
    const availableColors = ['#EAE7E2', '#D7E2E8', '#B9CBD9', '#FCC9C5', '#CFE3E2'];
    {/* Konstanta uchovavajici aktualne vybranou barvu */}
    const [selectedColor, setSelectedColor] = useState(availableColors[0]);
    {/* Konstanta uchovavajici editovanou polozku  */}
    const [editableActivity, setEditableActivity] = useState({ name: '', color: '', startTime: '', endTime: '' });
    {/* Konstanta uchovavajici stav modalniho okna pro vkladani polozky */}
    const [modalVisible, setModalVisible] = useState(false);
    {/* Konstanta uchovavajici vybrany den pro vlozeni polozky */}
    const [selectedDay, setSelectedDay] = useState(null);
    {/* Pole dnu, do kterych je mozno vkladat polozky */}
    const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr'];
    {/* Promenna uchovavajici informace o vkladane polozce */}
    const [newEvent, setNewEvent] = useState({ day: 'Tu', activity: '', startTime: '', endTime: '' });
    {/* Konstanta uchovavajici stav modalniho okna pro editaci vybrane polozky */}
    const [isModalVisible, setIsModalVisible] = useState(false);
    {/* Pole pro generaci casove osy v hornich castech aplikace */}
    const hours = Array.from({ length: 12 }, (_, i) => 8 + i);
    {/* Funkce pro zobrazeni modalniho okna pro vkladani polozky */}
    const handleOpenModal = () => setModalVisible(true);
    {/* Funkce pro zavreni modalniho okna pro vkladani polozky */}
    const handleCloseModal = () => setModalVisible(false);
    {/**
     * Funkce pro otevreni modalniho okna pro editaci vybrane polozky
     * @param activity vybrana aktivita, ktera se bude editovat
     * @param day ke kteremu dni dana aktivita prislusi (pro moznost vyhledani teto aktivity v prislusnem 2D poli)
     * @param index index polozky v poli (slouzi jako univerzalni klic)
     * 
    */ }
    const openEditModal = (activity, day, index) => {
        setEditableActivity({ ...activity, day, index }); //Nastaveni jakou polozku aktualne editujeme
        setIsModalVisible(true);
    };
    {/* Funkce pro generaci casove osy */}
    const TimeAxis = () => (
        <View style={styles.timeAxis}>
            {hours.map(hour => ( //Generujeme pomoci medoty map nad polem, unikatnim klicem kazde polozky je pak cislo, ktere reprezentuje danou hodinu
                <Text key={hour} style={styles.hourText}>{hour}</Text>
            ))}
        </View>
    );
    {/**
     * Tlacitko reprezentujici den
     * @param day reprezentuje o jaky den se jedna (Mo, Tu, ...)
     * @param onSelectDay timto parametrem je predavana funkce, ktera nastavi dany den jako vybrany
     * @param isSelected bool hodnota udavajici, pokud je dany den vybrany nebo ne, na zaklade toho se voli styl tlacitka
     * 
    */}
    const DayButton = ({ day, onSelectDay, isSelected }) => {
        return (
            <TouchableOpacity 
                style={isSelected ? styles.dayButtonPressed : styles.dayButton} //Vyber stylu tlacitka
                onPress={() => onSelectDay(day)} //Volani funkce pro nastaveni dne jako zvoleny
            >
                <Text>{day}</Text> 
                {/* Textove oznaceni dne */}
            </TouchableOpacity>
        );
    };
    {/* Funkce pro generaci tlacitek pro moznost vyberu dne*/}
    const renderDayButtons = () => {
        return daysOfWeek.map((day, index) => ( //Pomoci funkce map je projito pole dnu, na jehoz zaklade se generuji dny
            <DayButton 
                key={index} //unikatni klic
                day={day} //nazev dne
                onSelectDay={setSelectedDay} //funkce pro nastaveni vybraneho dne je predavana jako parametr
                isSelected={selectedDay === day} //bool hodnota udavajici zdali je den vybrany nebo ne
            />
        ));
    };
    {/**
     * Tlacitko pro vyber barvy
     * @param color dana barva 
     * 
    */} 
    const ColorButton = ({ color, onSelectColor, isSelected }) => {
        return (
            <TouchableOpacity 
                style={[styles.colorButton, { backgroundColor: color, borderColor: isSelected ? 'grey' : 'transparent' }]} 
                onPress={() => onSelectColor(color)}
            />
        );
    };
    {/* Funkce pro generaci tlacitek pro moznost vyberu barvy dane polozky */}
    const renderColorButtons = () => {
        return availableColors.map((color, index) => ( //pomoci metody map nad polem je pole prochazeno a generuji se prislusne tlacitka
            <ColorButton 
                key={index} //unikatni klic
                color={color} //barva (slouzi zaroven pro obarveni tlacitka)
                onSelectColor={setSelectedColor} //funkce pro nastaveni vybraneho tlacitka za zvolenes je predavana jako parametr
                isSelected={selectedColor === color} //bool hodnota udavajici zdali je tlacitko vybrane nebo ne
            />
        ));
    };
    {/* Funkce pro vlozeni nove polozky ke spravnemu dni */}
    const handleAddEvent = () => {
        const updatedSchedule = {...schedule}; //Zkopirujeme aktualni polozky
        newEvent.day=selectedDay //do novehop eventu, ktery vkladame, vlozime zvoleny den
        updatedSchedule[newEvent.day].push({ //Vlozime do pole k prislusnemu dni novou polozku se zvolenymi parametry
            activity: newEvent.activity,
            startTime: newEvent.startTime, 
            endTime: newEvent.endTime,
            color: selectedColor
        });
        setSchedule(updatedSchedule); //Nastavime updatnute pole dnu s polozkami jako hlavni
        setNewEvent({ day: '', activity: '', startTime: '', endTime: '' }); //Resetujeme pro moznost vlozeni dalsi polozky, aby nic nebylo implicitne nastaveno
        setSelectedDay(null); 
        handleCloseModal(); //Zavrme modalni okno pro vkladani
    };
    {/**
     * Funkce pro vypocet posunuti polozky horizontalne na zaklade vybraneho casu 
     * @param time vybrany cas
     *
    */}
    const calculatePosition = (time) => {
        const time_int = parseInt(time) //Prevod na integer
        switch(time_int){ //Podle zvoleneho casu je vraceno posunuti teto polozky vuci leve strane obrazovky
            case 8:
                return 45;
            case 9:
                return 73;
            case 10:
                return 100;
            case 11:
                return 130;
            case 12:
                return 160;
            case 13:
                return 193;
            case 14: 
                return 225;
            case 15:
                return 255;
            case 16:
                return 285;
            case 17:
                return 315;
            case 18:
                return 347;
            case 19:
                return 380;
        }
        return -10;
    };
    {/* Funcke odstranujici vybranou aktivitu */}
    const removeActivity = () => {
        const updatedActivities = [...schedule[editableActivity.day]]; //kopie vsech aktivit pro vybrany den, ve kterem se aktivita nachazi

        updatedActivities.splice(editableActivity.index, 1); //odstranime aktivitu na danem indexu
        setSchedule(prevSchedule => ({ //Nastavime updatnuty den s odstranenou aktivitou jako hlavni
            ...prevSchedule,
            [editableActivity.day]: updatedActivities
        }));
        setIsModalVisible(false); //Zavreme modalni okno
        setEditableActivity({ index: null, day: 'Tu', activity: '', startTime: '', endTime: '', color: '' }); //Vyresetujeme vybranou aktivitu na prazdnou
    };
    {/**
     * Funkce pro vytvoreni dane aktivity ve vybranem dni
     * @param event samotna aktivita, uchovava nazev, cas od do, ...
     * @param day vybrany den, ke kteremu ma byt aktivita prirazena
     * @param index index, na ktery ma byt aktivita vlozena do pole, unikatni id polozky
    */}
    const ActivityItem = ({event, day, index}) => {
        const startPosition = calculatePosition(event.startTime); //Vypocet posunuti horizontalne
        const endPosition = calculatePosition(event.endTime); 
        const width = endPosition - startPosition; //Vypoet sirky polozky (dan startem a koncem aktivity)
    
        return (
            <TouchableOpacity style={[styles.activityItem, { left: startPosition, width: width , backgroundColor: event.color}]} //predavani potrebnych atributu stylu polozky jako parametry
            onPress={() => openEditModal(event, day, index)} //Pri kliknuti na aktivitu se otevre modalni okno pro editaci vybrane polozky
            >
                <Text style={styles.activityText}>{event.activity}</Text>
                {/* Textove znacen aktivity */}
            </TouchableOpacity>
        );
    };
    {/**
     * Funkce reprezentujici zobrazeni vsech aktivit pro dany den
     * @param dayName nazev dne
     * @param events pole vsech aktivit pro dany den
    */}
    const DayView = ({ dayName, events }) => (
        <View style={styles.dayContainer}>
            <Text>{dayName}</Text> 
            {/* Textove oznaceni dne */}
            {events.map((event, index) => ( //Pomoci metody map nad polem jsou generovany jednotlive polozky
                <ActivityItem key={index} event={event} day={dayName} index={index}/> //Volani funkce pro zobrazeni danych polozek
            ))}
        </View>
    );
    {/* Funkce pro spravne upraveni polozky pri editaci */}
    const handleEditEvent = () => {
        const dayActivities = [...schedule[editableActivity.day]]; //Kopie polozek pro dany den, ve kterem se vybrana polozka edituje
        dayActivities[editableActivity.index] = {
        ...dayActivities[editableActivity.index],
        activity: editableActivity.activity, //Znema nazvu
        startTime: editableActivity.startTime, //zmena casu startu
        endTime: editableActivity.endTime, //zmena casu konce
        color: selectedColor //zmena barvy
    };

    const updatedSchedule = {...schedule, [editableActivity.day]: dayActivities}; //Vlozeni upravenych polozek k prislusnemu dni
    setSchedule(updatedSchedule); //Nastavi nove pole s upravenou polozkou jako hlavni

    setIsModalVisible(false); //Zavreni modalniho okna pro editaci
    setEditableActivity({ index: null, day: '', activity: '', startTime: '', endTime: '', color: '' }); //reset vybrane polozky pro editace na prazdnou
    setSelectedDay(null);
    };
 
    return(
    <View style={styles.main}>
            <TimeAxis style={styles.timeAxis}/> 
            {/* Generace casove osy */}
            <View>
                {daysOfWeek.map((day, index) => ( //Zobrazeni jednotlivych dnu pomoci metody map nad polem
                    <DayView key={index} dayName={day} events={schedule[day]} /> 
                ))}
            </View>
        <Modal //Modalni okno pro vlozeni nove polozky
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        >
        <View style={styles.popupAdd}>
                <View style={styles.addItem}>
                <View style={styles.dayButtonContainer}>
                    {renderDayButtons()} 
                    {/* Vyobrazeni tlacitek pro volbu dne, ke kteremu bude aktivita priorazena */}
                </View>
                    <View style={styles.addItemTextInput}>
                        <TextInput //Textovy vstup pro volbu nazvu polozky
                            placeholder="Name"
                            value={newEvent.activity}
                            onChangeText={(text) => setNewEvent({...newEvent, activity: text})} //pri zmene textu se vepsany text nastavi jako nazev aktivity
                        />
                    </View>
                    <View style={styles.addItemTimeInput}>
                        <View style={styles.addItemStartTime}> 
                            <TextInput //Textovy vstup pro zacatek aktivity
                                inputMode="numeric"
                                placeholder="Time start (h)"
                                value={newEvent.startTime}
                                onChangeText={(text) => setNewEvent({...newEvent, startTime: text})} //pri zmene textu se vepsany text nastavi jako cas startu aktivity
                            />
                        </View>
                        <View style={styles.addItemEndTime}>
                            <TextInput //Textovy vstup pro konec aktivity
                                inputMode="numeric"
                                placeholder="Time end (h)"
                                value={newEvent.endTime}
                                onChangeText={(text) => setNewEvent({...newEvent, endTime: text})} //pri zmene textu se vepsany text nastavi jako cas konce aktivity
                            />
                        </View>
                    </View>
                    <View style={styles.colorButtonContainer}>
                        {renderColorButtons()} 
                        {/* Vyobrazeni tlacitek pro volbu barvy */}
                    </View>

                    
                    <View style={styles.addItemButtons}>
                        <TouchableOpacity onPress={handleAddEvent} style={styles.addItemButtonDone}>
                        {/* Tlacitko pro vlozeni polozky s danymi parametry do Scheduleru,
                        * pri kliknuti se cola funkce handleAddEvent
                        */}
                            <Text style={styles.addItemButtonsText}>
                            Confirm
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCloseModal} style={styles.addItemButtonCancel}>
                            {/* Tlacitko pro zahozeni zmen,
                            * pri kliknuti je volana funkce hanldeCloseModal, zavre se okno pro vkladani polozky
                            */}
                            <Text style={styles.addItemButtonsText}>
                            Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
        <Modal //Modalni okno pro editaci polozky
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        transparent={true}
        >
            <View style={styles.editModal}>
            <TextInput //Textovy vstup pro zmenu nazvu polozky
            style={styles.activityNameInput}
            onChangeText={(text) => setEditableActivity({...editableActivity, activity: text})} //pri zmene textu je vepsany text nasatven jako novy nazev polozky
            value={editableActivity.activity}
            placeholder="Name"
            />       
            </View>
            <View style={styles.addItemTimeInputEdit}>
                    <View style={styles.addItemStartTimeEdit}> 
                        <TextInput //Textovy vstup pro novy zacatek aktivity
                            inputMode="numeric"
                            placeholder="Time start (h)"
                            value={editableActivity.startTime}
                            onChangeText={(text) => setEditableActivity({...editableActivity, startTime: text})} //pri zmene je vepsany text nastaven jako novy start polozky
                        />
                    </View>
                    <View style={styles.addItemEndTimeEdit}>
                        <TextInput //Textovy vstup pro novy konec aktivity
                            inputMode="numeric"
                            placeholder="Time end (h)"
                            value={editableActivity.endTime}
                            onChangeText={(text) => setEditableActivity({...editableActivity, endTime: text})} //pri zmene je vepsany text nastaven jako novy konec polozky
                        />
                    </View>
                </View>
                <View style={styles.colorButtonContainerEdit}>
                    {renderColorButtons()} 
                    {/* Generace tlacitek pro volbu nove barvy polozky */}
                </View>
                <View style={styles.dayButtonContainerEdit}>
                    {renderDayButtons()} 
                    {/* Generace tlacitek pro volbu noveho dne polozky */}
                </View>
            <View style={styles.addItemButtonsEdit}>
            <TouchableOpacity onPress={handleEditEvent} style={styles.addItemButtonDone}>
                {/* Tlacitko pro potvrzeni nove vlozenych zmen
                * pri stisku se vola funkce handleEditEvent
                */}
                <Text style={styles.addItemButtonsText}>
                Confirm
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={removeActivity} style={styles.addItemButtonCancel}>
                
                {/* Tlacitko pro odstraneni polozky ze Scheduleru
                * pri stisku se vola funkce removeActivity
                */}
                 
                <Text style={styles.addItemButtonsText}>
                Delete
                </Text>
            </TouchableOpacity>

        </View>
        </Modal>
        <TouchableOpacity style={styles.add} onPress={handleOpenModal}> 
        {/* Tlacitko pro pridani nove polozky, pro stisku se vola funkce handleOpenModal */}
                            <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
        
    </View>
    );
}
{/* Jednotlive styly komponent aplikace */}
const styles = StyleSheet.create({
    main:{ //Nejvrchnejsi view, pouze pozadi
        backgroundColor: '#FAEED1'
    },
   DayText: { //Text dne
    fontSize: 24,
    marginTop: 5,
   },
   timeAxis: { //Casova osa
    flexDirection: 'row',
   },
   hourText: { //Styl cisel na casove ose
    left: 45,
    marginRight: 15,
   },
   dayContainer: {  //zobrazeni jednotlivych dnu
    height: 138.55,
    backgroundColor: '#DED0B6',
    marginBottom: 10,
    width: 500,
   },
    activityItem: { //Jednotliva polozka ve dnu
        position: 'absolute',
        height: 133.55,
        borderRadius: 5,
        marginTop: 2.5,
        marginBottom: 2.5,
        borderColor: 'black',
        borderWidth: 1,
    },
    activityText: { //text polozky
        fontSize: 10,
        marginBottom: 'auto',
        marginTop: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    add: { //Tlacitko por pridani nove polozky
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
    plus: { //Text tlacitka pro pridani nove polozky
        fontSize: 24,
        fontWeight: 'bold',
        position: 'absolute',
        paddingLeft: 28,
    },
    addItem: { //modalni okno pro pridani nove polozky
        width: 350,
        height: 450,
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: 'auto',
        marginTop: 'auto',
        marginTop: 100,
        backgroundColor: 'rgba(240, 219, 175, 0.8)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'grey',
    },
    addItemButtons: { //Tlacitka v modalnim okne pro pridani nebo zruseni
        flexDirection: 'row',
        top: 225,
        justifyContent: 'center',
    },
    addItemButtonDone: { //Tlacitko pro pridani aktivity
        backgroundColor: '#304D30',
        marginRight: 10,
        width: 120,
        height: 50,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 15,
    },
    addItemButtonCancel: { //Tlacitko pro zahozeni zmen
        backgroundColor: '#BE3144',
        marginLeft: 10,
        width: 120,
        height: 50,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 15,
    },
    addItemButtonsText: { //Text tlacitek 
        alignSelf: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
        fontSize: 24,
    },
    addItemTextInput: { //Textovy vstup pro nazev polozky
        backgroundColor: 'white',
        position: 'absolute',
        width: 250,
        height: 80,
        alignSelf: 'center',
        top: 50,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 15,
        justifyContent: 'center',
    },
    addItemTimeInput: { //Casovy vstup
        top: 180,
        flexDirection: 'row',
        marginRight: 'auto',
        marginLeft: 'auto',
    },
    addItemStartTime: { //Casovy vstup pro zacatek
        marginRight: 10,
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 15,
        width: 120,
        height: 50,
        justifyContent: 'center'
    },
    addItemEndTime: { //Casovy vstup pro konec
        marginLeft: 10,
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 15,
        width: 120,
        height: 50,
        justifyContent: 'center'
    },
    dayButtonContainer: { //rozlozeni tlacitek pro vyber dne
        flexDirection: 'row',
        justifyContent: 'space-around',
        top: 150,
    },
    dayButton: { //samotne tlacitko pro vyber dne
        padding: 15,
        margin: 3,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        backgroundColor: 'white'
    },
    dayButtonPressed: { //stisknute tlacitko pro vyber dne
        padding: 15,
        margin: 3,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        backgroundColor: 'grey'
    },
    colorButtonContainer: { //rozlozeni tlacitek pro volbu barvy
        flexDirection: 'row',
        top: 200,
        alignSelf: 'center',
    },
    colorButton: { //samotne tlacitko pro volbu barvy
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 5,
        borderWidth: 1,
    },
    editModal: { //Modalni okno pro editaci aktivity
        position: 'absolute',
        width: 350,
        height: 450,
        top: 150,
        backgroundColor: 'rgba(240, 219, 175, 0.8)',
        alignSelf: 'center',
        borderRadius: 20,
        marginBottom: 10,
        padding:10,
    },
    activityNameInput: { //textovy vstup pri editaci polozky, nazev
        backgroundColor: 'white',
        position: 'absolute',
        width: 250,
        height: 80,
        alignSelf: 'center',
        top: 50,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 15,
        justifyContent: 'center',
    },
    addItemTimeInputEdit: { //rozlozeni vstupu pro cas pri editaci
        top: 380,
        flexDirection: 'row',
        marginRight: 'auto',
        marginLeft: 'auto',    
    },
    addItemStartTimeEdit: { //vstup pro cas pri editaci, start
        marginRight: 10,
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 15,
        width: 120,
        height: 50,
        justifyContent: 'center'
    },
    addItemEndTimeEdit: {//vstup pro cas pri editaci, konec
        marginLeft: 10,
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 15,
        width: 120,
        height: 50,
        justifyContent: 'center'
    },
    colorButtonContainerEdit: { //rozlozeni tlacitek pro vyber barvy pri editaci
        flexDirection: 'row',
        top: 400,
        alignSelf: 'center',
    },
    addItemButtonsEdit: { //rozlozeni tlacitek pro ulozeni nebo odstraneni polozky
        flexDirection: 'row',
        top: 370,
        justifyContent: 'center',
    },
    popupAdd: { //margin elementu pri editaci
        marginBottom: 10,
    },
    dayButtonContainerEdit: { //rozlozeni tlacitek pro vyber dne pri editaci aktivity
        flexDirection: 'row',
        justifyContent: 'center',
        top: 200,
    },
});