import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, ToastController } from '@ionic/angular';
//import { constants } from 'buffer';
//import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

// const headersimage = new HttpHeaders({
//   'Content-Type': 'multipart/form-data'
// });
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
});


@Injectable({
  providedIn: 'root'
})
export class ApiLaravelService {
  authUser = '';
  promo;
  api;

  constructor(  private http: HttpClient, public toastController: ToastController,
                public alertController: AlertController,
                private router: Router ) {
    this.leerToken();
    this.promo = localStorage.getItem('promo_id');
    this.api = 'https://api.sysop.info/mineralizada/public/api/';
    // this.api = 'https://api.somostopochico.com/public/api/';
    // this.api = 'http://localhost/api/';
  }

  // heroe: any;
  // api = 'https://api.tabletizate.com/public/api/';

  // JEspinosa Login de usuario
  postUsersLogin(email, password) {

    return this.http.post(this.api + 'login', { correo : email , pass : password, promo_id : this.promo  } , { headers });

  }

  // Login en red social
  postUsersLoginSocial(email, provider, id, img) {

    return this.http.post(this.api + 'loginSocial', { correo : email , providerSocial : provider, idSocial : id, image: img, promo_id : this.promo } , { headers });

  }


  getPresentation(promoId = null){

    let promo_id = localStorage.getItem('promo_id');
    // debugger;
    if(promoId){
      promo_id = promoId;
    }
    // debugger;
    return this.http.post(this.api + 'get/presentations',{ promo : promo_id } ,{ headers });
  }

  getStates() {
    return this.http.post(this.api + 'get/states', { promo_id : this.promo  } , { headers });
  }

  //  Cambio de conraseña
  resetPassword( tokenResetPass, pass ){
    // debugger;
    return this.http.post(this.api + 'user/changePassword', { token : tokenResetPass , password : pass } , { headers });
  }

  //  Valida el token para saber si expiro o si existe para el camboio de contraseña
  validTokenUser( user_id, tokenUser){
    return this.http.get(this.api + 'resetPassword/' + user_id + '/' + tokenUser);
  }


  // Valida el token de referido
  referUser( token ){
    return this.http.post(this.api + 'referUser',
    { nickName: token} ,
    { headers });
  }

  // Inserta el usuario referido
  postInsertRefer(userId, referId){
    return this.http.post(this.api + 'insertRefer', { user : userId, refer : referId, promo_id : 1 } , { headers });
  }

  // Insert de usuario nuevo
  // postInsertUser(correo, pass, nombre, ciudad, zip, street, suburb, city, state, telefono, birthdate, nickName, image, extension, stateUser) {
    postInsertUser(correo, pass, nombre, telefono, birthdate, nickName, image, extension) {

    // debugger;
    return this.http.post(this.api + 'register',
    { email: correo,
      password: pass,
      name: nombre,
      // country: ciudad,
      // cp: zip,
      // street,
      // suburb,
      // city: ciudad,
      // state,
      cellPhone: telefono,
      promo_id: this.promo,
      birthdate: birthdate,
      nickName: nickName,
      img: image,
      // state_id: stateUser,
      extension: extension,
      campaign: localStorage.getItem('validCampaign'), } ,
    { headers });

  }

  getProductsStore(promoId){

    return this.http.get( this.api+'get/productsStore/'+promoId,  { headers } );

  }

  getDetailsProduct(){
    return this.http.get( this.api+'get/productsStore/',  { headers } );
  }

  paymentProduct( wallet, product, address ){
    return this.http.post(this.api + 'insert/buy/product', { wallet, product, address } , { headers });
  }

  getProductsDetails(product_id){
    return this.http.get(this.api + 'get/details/product/' + product_id + '/' + localStorage.getItem('user.token'));
  }


  // Muestra los amugos referidos que tienes
  referUserFriends( token ){
    return this.http.post(this.api + 'refer/friends',{ nickName: token, promo_id: 1 } , { headers });
  }

  // Registro de usuario nuevo a traves de red social
  postInsertUserSocial(correo,  nombre, telefono, birthdate, nickName , img, id, provider, token, stateUser) {
    // postInsertUserSocial(correo,  nombre, ciudad, zip, street, suburb, city, state, telefono, birthdate, nickName , img, id, provider, token, stateUser) {
    return this.http.post(this.api + 'registerSocial',
    { email: correo,
      name: nombre,
      // country: ciudad,
      // cp: zip,
      // street,
      // suburb,
      // city,
      // state,
      cellPhone: telefono,
      // tslint:disable-next-line:object-literal-shorthand
      birthdate: birthdate,
      // tslint:disable-next-line:object-literal-shorthand
      nickName: nickName,
      image: img,
      tokenSocial:  token,
      providerSocial: provider,
      state_id: stateUser,
      idSocial: id} ,
    { headers });

  }

  // valida si ya existe el usuario de red social
  validExistsUserSocial(email, provider, token){
    return this.http.post(this.api + 'validExistsUserSocial',
    { emailSocial: email,
      providerSocial:  provider,
      tokenSocial: token
    },
    { headers });
  }

  // Update del perfil
  postUpdateUser(correo, nombre, ciudad, zip, telefono, birthdate, nickName, token, image, extension, state) {

    // debugger;
    return this.http.post(this.api + 'updateProfile',
    { email: correo,
      name: nombre,
      country: ciudad,
      cp: zip,
      cellPhone: telefono,
      // tslint:disable-next-line:object-literal-shorthand
      birthdate: birthdate,
      // tslint:disable-next-line:object-literal-shorthand
      nickName: nickName,
      // tslint:disable-next-line:object-literal-shorthand
      token: token,
      img: image,
      state_id: state,
      // tslint:disable-next-line:object-literal-shorthand
      extension: extension,
      promo_id: this.promo } ,
    { headers });

  }

  // Inserta los tickets
  postInsertTicket(img, extend, date, store, arrPresentation, stateUser, promo_id) {

    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(this.api + 'createTicket', { token: localStorage.getItem('user.token'), images: img, extension: extend, fecha: date, presents: arrPresentation, store: store, promo_id : promo_id, state_id: stateUser } , { headers } );

  }

  // Trae la info del miniGame
  getMiniGame(idMinigame){

    // tslint:disable-next-line:object-literal-shorthand
    // console.log(localStorage.getItem('user.token'));
    return this.http.post(this.api + 'miniGame/get', { token: localStorage.getItem('user.token'), idMiniGame: idMinigame } , { headers } );

  }

  postNoGame(idMinigame){
    return this.http.post(this.api + 'miniGame/notGame', { token: localStorage.getItem('user.token'), idMiniGame: idMinigame } , { headers } );
  }

  // Enviar correo para cambiar la contraseña
  sendEmail(emailReset){

    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(this.api + 'user/resetPassword', { email: emailReset } , { headers } );

  }

  // inserta registro de share
  postInsertShare(img, url, user, extensionShare){
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(this.api + 'createAppShare', { nickName: user, image: img, url: url, extension: extensionShare, promo_id : this.promo} , { headers } );
  }

  // Edita la info del compartido en redes sociales
  postUpdateShare(img, url, idShare, extensionShare, user){
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(this.api + 'appShare/update', { nickName: user, id: idShare, image: img, url: url, extension: extensionShare, promo_id : this.promo} , { headers } );
  }

  // Valida si ya existe un registro de redes sociales
  validExistShare(user){
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(this.api + 'validExistShare', { nickName: user, promo_id : this.promo} , { headers } );
  }


  async presentAlertConfirm( messa: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Aviso!',
      message: messa,
      buttons: [ {
          text: 'Enterado'
        }
      ]
    });

    await alert.present();
  }

  // Trae la información del usuairo logueado
  getUserInfo(token, promoId = null) {

    let promo_id = this.promo;
    if(promoId){
      promo_id = promoId;
    }

    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(this.api + 'user/info/score', { token: token, promo_id }, { headers });

  }

  changeValidFriend(userId) {

    // debugger;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(this.api + 'user/validFriend', { userId: userId }, { headers });

  }

  // Muestra la informaciòn del perfil
  getUser(token) {

    // debugger;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(this.api + 'user/profile', { token: token, promo_id : this.promo }, { headers });

  }

  // Trae los tickets registrados por el usuario
  getTickets(token) {

    // debugger;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(this.api + 'get/tickets', { token: token, promo_id: this.promo }, { headers });

  }

  getVouchers(token){
    const promo_id = 2;
    return this.http.post(this.api + 'get/vouchers', { token: token, promo_id }, { headers });
  }

  // Muestra el top de jugadores
  getTopList(token) {

    return this.http.post(this.api + 'user/topList', { token: token, promo_id: this.promo }, { headers });

  }

  // hace un refresh para mostrar los demas tickets
  getTicketsPaginate(token, paginate) {

    return this.http.post(this.api + 'get/tickets?page=' + paginate, { token: token }, { headers });

  }

  getVouchersPaginate(token, paginate){
    return this.http.post(this.api + 'get/vouchers?page=' + paginate, { token: token }, { headers });
  }

  // trae los periodos
  getPeriods(dateMax, promo_id = null) {

    // let promo_id = localStorage.getItem('promo_id');
    // if(promoId){
    //   promo_id = promoId;
    // }

    // console.log(promo_id);
    // debugger;
    return this.http.get(this.api + 'periods/get/non/' + promo_id + '/' + true);

  }

  getRegisterPeriods( promoId = 1) {

    return this.http.get(this.api + 'periods/get/non/' + promoId + '/' + true);

  }


  getPopUp(user_id){
    return this.http.post(this.api + 'popUps/get/information', {user_id} ,{headers} );
  }

  updatePopUpUser(user_id,pop_id){
    return this.http.post(this.api + 'popUps/insert/popUpUser', {user_id, pop_id} ,{headers} );
  }

  getWinnersPeriods(period){
    return this.http.post(this.api + 'winners/period/' + period , { headers });
  }

  disableModalHome(user_token){
    return this.http.post(this.api + 'popUps/modalHome/nonShow', { user_token } , { headers });
  }

  getAllPeriods(){
    // return this.http.post(this.api + 'periods/get/all');
    return this.http.post(this.api + 'periods/get/all', { promo_id: this.promo } , { headers });
  }

  authenticate(): boolean {
    // debugger;
    return this.authUser.length > 2;

  }

  async presentToastDanger(messag: string) {
    const toast = await this.toastController.create({
      message: messag,
      duration: 2000,
      position: 'top',
      color: 'danger'
    });
    toast.present();
  }

  async presentToastSuccess(messag: string) {
    const toast = await this.toastController.create({
      message: messag,
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    toast.present();
  }

  // Valida version del usuario
  validversion(){
    this.http.post(this.api + 'user/validVersion', { token: localStorage.getItem('user.token') } , { headers }).subscribe(resp => {
      // debugger;
      // tslint:disable-next-line:no-string-literal
      if (resp['message'] === 'change'){
        // location.href('https://destrezate.mx/customer/home');
        // window.location.href = 'https://destrezate.mx/customer/home';
        window.location.reload();
      }
    });
  }

  getAvisos(tokenUser){
    return this.http.post(this.api + 'avisos/get/all', {token: tokenUser} , { headers });
  }

  deleteAviso(idAviso, tokenUser){
    return this.http.post(this.api + 'avisos/delete/user', {id_aviso: idAviso, token: tokenUser} , { headers });
  }

  async logout() {
    localStorage.clear();
    window.location.reload();
    // this.router.navigateByUrl('/login');
  }

  //  Top winnners
  topWinners(period){
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(this.api + 'user/topList', { period: period }, { headers });
  }

  //  Minigame
  miniGamePoints(points, level, miniGame){
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(this.api + 'miniGame/getpoints', { points: points, levelGame: level, id_minigame: miniGame }, { headers });
  }

  // campaign
  getMessages(section, slug){
    return this.http.post(this.api + 'get/campaign', {section, slug} , { headers });
  }

  //--------------------Award--------------
    //---------------------------------------
    //---------------------------------------
    // Get Image Global
    getImageAward(type){
      return this.http.post(this.api + 'get/imageGlobal', {type, promo : this.promo} , { headers });
    }

    getAwardsPromotion(windows, pwa){
      // console.log(localStorage.getItem('promo_id'));
      // debugger;
      return this.http.get(this.api + 'get/promotion/awards/' + localStorage.getItem('promo_id') + '/' + windows + '/' + pwa,{headers});
    }


    //---------------------------------------
    //---------------------------------------
  //--------------------End Award----------


  // blance
  getHistoryBalance(token){
    return this.http.post(this.api + 'get/history/balance', { token } , { headers });
  }

  getImageCampaing(type){
    return this.http.post(this.api + 'get/imageGlobal/campaign', {type, promo : this.promo} , { headers });
  }


  getBalanceWallet(){
    let tokenUser = localStorage.getItem('user.token');
    return this.http.get(this.api + 'get/balance/user/'+tokenUser );
  }


  getAddressUser(user_id){

    return this.http.get(this.api + 'get/address/user/'+ user_id );

  }

  // orders
  getOrdersHistory(token){
    return this.http.post(this.api + 'get/history/orders', { token } , { headers });
  }


  // Guarda la infromación del usuario
  guardarUser( user: any ) {

    // debugger;
    if ( user.user ) {
      localStorage.setItem('user.nickName', user.user.nickName);
      localStorage.setItem('user.token', user.user.token);
      localStorage.setItem('user.email', user.user.email);
      this.presentToastSuccess('Bienvenido ' + user.user.name);
      this.leerToken();
      this.router.navigateByUrl('/home');
    }else{
      localStorage.setItem('user.token', '' );
      localStorage.setItem('user.email', '' );
      localStorage.setItem('user.nickName', '' );
      this.presentToastDanger('Usuario y contraseña no validas');
    }
  }

  leerToken() {
    if ( localStorage.getItem('user.token') ){
      this.authUser = localStorage.getItem('user.token');
    }else{
      this.authUser = '';
    }
  }





}
