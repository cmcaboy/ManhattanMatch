import React from 'react';
import {
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Platform, 
  Dimensions, 
  Image, 
  ImageEditor 
} from 'react-native';
import uploadImage from '../firebase/uploadImage';
import {Spinner,CardSection} from './common';
import {
  startProfilePicture,
  startChangeAncillaryPictures,
} from '../actions/profile';
import {ImagePicker} from 'expo';
import {connect} from 'react-redux';

const placeholderURL = 'https://firebasestorage.googleapis.com/v0/b/stagg-test.appspot.com/o/add_pic.png?alt=media&token=5328312a-bd1a-4328-b355-2c80210b96ed'

class PhotoSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: this.props.urlList.map(item => false),
      isSelected: this.props.urlList.map(item => false),
      urlList: this.props.urlList
    }
  }

  pickImage = (i) => {
    this.setState(prevState => ({isLoading: prevState.isLoading.map((item,index) => index===i? true : item)}));
    ImagePicker.launchImageLibraryAsync({
      allowEditting: true,
      aspect: [2,1]
    }).then((result) => {
      if(result.cancelled) {
        return
      }
      ImageEditor.cropImage(result.uri, {
        offset: {x:0,y:0},
        size: {width: result.width, height: result.height},
        displaySize: {width:200, height:200},
        resizeMode: 'container'
      }, async (uri) => {
        const url = await uploadImage(uri);
        //console.log('i: ',i);
        if(i===0) {
          this.props.startProfilePicture(url);
        } else {
          const urlList = this.state.urlList.splice(1).map((item,index) => {
            //console.log('item: ',item);
            //console.log('index: ',index);
            return index === i-1 ? url : item
          });
          this.props.startChangeAncillaryPictures(urlList);
        }
        
        
        this.setState(prevState => ({isLoading: prevState.isLoading.map((item,index) => index===i? false:item)}));

        // Now that the image has been selected, we need to upload the image
        // to firebase storage.

        /*
        console.log('uri: ',uri);
        const storageRef = firebase.storage().ref(`profile_pictures/${uri}`);
        let task = storageRef.put(uri);
        task.on('state_changed',
          (snapshot) => {
            let percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100
            console.log(`Upload is ${percentage}% done.`)
          },
          (error) => console.log('error uploading file: ',error),
          (complete) => startProfilePicture(task.snapshot.downloadURL)
        )
        */
      },
      () => console.log('Error'))
    })
  }

  switchPicPosition = (a,b) => {
    let temp = this.state.urlList;
    const tempItem = temp[a];
    temp[a] = temp[b];
    temp[b] = tempItem;
    if(a === 0 || b === 0) {
      this.props.startProfilePicture(temp[0]);
      this.props.startChangeAncillaryPictures(temp.slice(1))
    } else {
      this.props.startChangeAncillaryPictures(temp.slice(1));
    }
  }

  resetSelected() {
    //console.log('reset selected');
    this.setState({isSelected: this.state.urlList.map(item => false)})
  }

  async selectImage(index) {
    await this.setState((prevState) => ({isSelected: prevState.isSelected.map((k,i) => i === index?!k:k)}))
    //console.log('select: ',this.state.isSelected);
    if(this.state.isSelected.filter(item => item === true).length === 2) {
      let a = [];
      this.state.isSelected.forEach((item,index) => {
        if(item === true) {
          a.push(index);
        }
      })
      await this.switchPicPosition(a[0],a[1]);
      this.resetSelected();
    }
  }

  // I had to do this for Android. The images would not re-render properly
  // without it.
  componentWillReceiveProps(nextProps) {
    //console.log('willReceiveProps: ',nextProps);
    if(nextProps.urlList) {
      this.setState({urlList:nextProps.urlList});
      this.setState({isSelected: nextProps.urlList.map(item => false)})
    }
  }

  render() {
    //console.log('urlList: ',this.props.urlList);
    //console.log('isSelected: ',this.state.isSelected);
    //console.log('isLoading: ',this.state.isLoading);
    return (
        <View style={styles.container}>
          {this.state.urlList.map((item,index) => {
            //console.log('item: ',item);
            return this.state.isLoading[index] ? (
              <Spinner key={index} size="small" style={styles.photo}/>
            ) : (
              <TouchableOpacity 
                key={index} 
                onPress={item!=placeholderURL? () => this.selectImage(index) : () => this.pickImage(index)}
                onLongPress={() => this.pickImage(index)}  
              >
                    <Image 
                      style={[styles.photo,this.state.isSelected[index] ? styles.highlighted : styles.notHightlighted]} 
                      source={{uri:item?item:placeholderURL}}
                    />
              </TouchableOpacity>
            )
          })}
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        //height: 150
    },
    photo: {
      borderRadius: ((Dimensions.get('window').width / 3) - 5) * 0.1,
      margin: 2,
      width: (Dimensions.get('window').width / 3) - 13,
      height: (Dimensions.get('window').width / 3) - 13,
      justifyContent: 'center',
      alignItems: 'center'
    },
    highlighted: {
      borderWidth: 3,
      borderColor: '#FFDF00'
    },
    notHighlighted: {
      borderWidth: 0
    }
});

const mapDispatchToProps = (dispatch) => {
  return {
      startProfilePicture: (profilePic) => dispatch(startProfilePicture(profilePic)),
      startChangeAncillaryPictures: (urlList) => dispatch(startChangeAncillaryPictures(urlList)),
  }
}

export default connect(undefined,mapDispatchToProps)(PhotoSelector);