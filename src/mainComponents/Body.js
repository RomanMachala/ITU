{/**
 * 
 * Implementace aplikace Student's scheduler pro predmet ITU - Tvorba uzivatelskych rozhrani 2023/2024
 * @author Machala Roman (xmacha86)
 * 
 * @brief hlavni telo aplikace spojujici jednotlive casti
 * 
*/}

//Import jednotlivych knihoven
import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

//Import jednotlivych casti aplikace
import Scheduler from './screens/Scheduler'
import TodoList from './screens/TodoList'


//Deklarace jmen pro casti aplikace
const SchedulerName = 'Scheduler';
const TodoListName = 'TodoList';

const Tab = createBottomTabNavigator(); //Vytvoreni spodniho menu


export default function MainComponent() {
    return(
       <NavigationContainer>
            <Tab.Navigator 
            initialRouteName={SchedulerName}    //Impilicitne nastavena stranka po spusteni aplikace
            screenOptions={({route}) => ({
                tabBarIcon: ({ focused, color}) => {
                    let iconName;
                    let rn = route.name;
                    //Dle aktualne zvolene stranky je ikona budto vyplnena nebo ne
                    if (rn === SchedulerName){
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (rn === TodoListName){
                        iconName = focused ? 'list' : 'list-outline';
                    }
                    return <Ionicons name={iconName} size={50} color={color} />
                
                },
                tabBarStyle: {height:70, borderTopWidth: 0,}, //Rozmery tlacitek
                // Chovani tlacitek pri jejich stisknuti, napriklad zmena barvy na cernou, pokud se nachazime na strance spojene s danym tlacitkem
                tabBarActiveTintColor: 'black', 
                tabBarInactiveTintColor: 'gray',
                tabBarActiveBackgroundColor: '#D7B575',
                tabBarInactiveBackgroundColor: '#F2D59B',
                keyboardHidesTabBar: true,
                headerShown: false
            })}
            
            >
            {/* Vytvoreni tlacitek v navigovacim menu pro prepinami mezi jednotlivymi castmi */}
            <Tab.Screen name={SchedulerName} component={Scheduler}/>
            <Tab.Screen name={TodoListName} component={TodoList}/>
            
            
            </Tab.Navigator>
       </NavigationContainer>
    );
}
