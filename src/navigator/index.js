import React from 'react';
import {TabNavigator, StackNavigator} from 'react-navigation';
import Settings from '../components/Settings';
import Leaderboard from '../components/Leaderboard';
import Stagg from '../components/Stagg';
import Matches from '../components/Matches';
import Messenger from '../components/Messenger';
import EditSettings from '../components/EditSettings';
import EditProfile from '../components/EditProfile';
import UserProfile from '../components/UserProfile';
import { FontAwesome, Ionicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import {Platform} from 'react-native';
import {TAB_BAR_HEIGHT,PRIMARY_COLOR} from '../variables';

const Tabs = TabNavigator({
    Settings: {
        screen: Settings,
        navigationOptions: {
            tabBarLabel: 'Settings',
            tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name='account' size={24} color={tintColor} />
          }
    },
    Stagg: {
        screen: Stagg,
        navigationOptions: {
            tabBarLabel: 'Stagg',
            tabBarIcon: ({ tintColor }) => <Entypo name='heart' size={24} color={tintColor} />
          }
    },
    Matches: {
        screen: Matches,
        navigationOptions: {
            tabBarLabel: 'Matches',
            
            tabBarIcon: ({ tintColor }) => <Entypo name='chat' size={24} color={tintColor} />
          }
    }
}, {
        initialRouteName: 'Stagg',
        navigationOptions: {
          header: null
        },
        tabBarOptions: {
          activeTintColor: Platform.OS === 'ios' ? PRIMARY_COLOR : 'white',
          showLabel: false,
          showIcon: true,
          style: {
            height: TAB_BAR_HEIGHT,
            backgroundColor: Platform.OS === 'ios' ? 'white' : PRIMARY_COLOR,
            shadowColor: 'rgba(0, 0, 0, 0.24)',
            shadowOffset: {
              width: 0,
              height: 3
            },
            shadowRadius: 6,
            shadowOpacity: 1
          }
        }
});

const MainNavigator = StackNavigator({
    Home: {
        screen: Tabs
    },
    Messenger: {
        screen: Messenger
    },
    EditSettings: {
        screen: EditSettings
    },
    EditProfile: {
        screen: EditProfile
    },
    UserProfile: {
        screen: UserProfile
    }
},
{
    mode: 'card',
    headerMode: 'screen',
    headerTitleStyle: {height: TAB_BAR_HEIGHT}

}
);

export default MainNavigator;
