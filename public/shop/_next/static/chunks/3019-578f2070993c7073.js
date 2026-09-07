"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3019],{34885:(e,t,r)=>{r.d(t,{$:()=>s,t:()=>c});var a=r(95155),i=r(12115),o=r(37186),n=r(36918),d=r(9969);let l=({type:e,title:t,message:r})=>{let i=n.xs[e];return(0,a.jsxs)("div",{className:"flex h-full w-full",children:[(0,a.jsx)("div",{className:"w-[0.5rem] rounded-bl-lg rounded-tl-lg",style:{backgroundColor:i.textColor},children:(0,a.jsx)(d.g,{icon:i.icon,size:"2xl",color:i.textColor,className:"m-4 ml-4 rtl:mr-4"})}),(0,a.jsxs)("div",{className:"m-4 ml-14 rtl:mr-14",children:[(0,a.jsx)("div",{className:`font-semibold ${i.textColor}`,children:t}),(0,a.jsx)("div",{className:`text-sm font-[400] ${i.textColor}`,children:r})]})]})},s=i.createContext({}),c=({children:e})=>{let t=(0,i.useRef)(null),r=(0,i.useRef)(null);return(0,a.jsxs)(s.Provider,{value:{showToast:e=>{let i=Date.now(),o=e.title?.trim?.()??"",n=e.message?.trim?.()??"",d=r.current;d&&d.type===e.type&&d.title===o&&d.message===n&&i-d.timestamp<1e3||(r.current={type:e.type,title:o,message:n,timestamp:i},t.current?.show({severity:e.type,life:e.sticky?void 0:e?.duration??2500,sticky:e.sticky??!1,contentStyle:{margin:0,padding:0},content:(0,a.jsx)(l,{type:e.type,title:e.title,message:e.message})}))}},children:[e,(0,a.jsx)(o.y,{ref:t})]})}},36918:(e,t,r)=>{r.d(t,{IL:()=>o,$i:()=>l,xs:()=>i,cS:()=>n,q4:()=>d,Bq:()=>f,E6:()=>p,SX:()=>u});var a=r(92584);let i={error:{bgColor:"#FFC5C5",textColor:"#FF0000",icon:a.rfe,iconBg:"#FFC5C5"},success:{bgColor:"#C6F7D0",textColor:"#34C759",icon:a.e68,iconBg:"#C6F7D0"},info:{bgColor:"#B2E2FC",textColor:"#2196F3",icon:a.iW_,iconBg:"#B2E2FC"},warn:{bgColor:"#F7DC6F",textColor:"#F7DC6F",icon:a.zpE,iconBg:"#F7DC6F"}},o=[{label:"cash",value:"COD",icon:a.CP4},{label:"card",value:"STRIPE",icon:a.$O8}],n="user-current-location",d=[{value:"English",code:"en",index:0},{value:"العربية",code:"ar",index:1},{value:"fran\xe7ais",code:"fr",index:2},{value:"ភាសាខ្មែរ",code:"km",index:3},{value:"中文",code:"zh",index:4},{value:"Deutsche",code:"de",index:5},{value:"עִברִית",code:"he",index:6},{value:"हिंदी",code:"hi",index:7},{value:"espa\xf1ol",code:"es",index:8},{value:"বাংলা",code:"bn",index:9},{value:"portugu\xeas",code:"pt",index:10},{value:"русский",code:"ru",index:11},{value:"اردو",code:"ur",index:12},{value:"Bahasa Indonesia",code:"id",index:13},{value:"日本語",code:"jp",index:14},{value:"T\xfcrk\xe7e",code:"tr",index:15},{value:"मराठी",code:"mr",index:16},{value:"తెలుగు",code:"te",index:17},{value:"Tiếng Việt",code:"vi",index:18},{value:"한국어",code:"ko",index:19},{value:"italiano",code:"it",index:20},{value:"ไทย",code:"th",index:21},{value:"ગુજરાતી",code:"gu",index:22},{value:"فارسی",code:"fa",index:23},{value:"polski",code:"pl",index:24},{value:"پښتو",code:"ps",index:25},{value:"rom\xe2nă",code:"ro",index:26},{value:"کوردی",code:"ku",index:27},{value:"ozbek",code:"uz",index:28},{value:"azərbaycan",code:"az",index:29},{value:"Nederlands",code:"nl",index:30},{value:"Қазақша",code:"kk",index:31}],l=["At_least_6_characters_label","At_least_one_lowercase_letter_(a-z)_label","At_least_one_uppercase_letter_(A-Z)_label","At_least_one_number_(0-9)_label","At_least_one_special_character","Password_does_not_match"];[...l];var s=r(50910),c=r(56788);let u=()=>{let e=(0,s.c)(),{isSingleVendor:t}=(0,c.q)(),r=[{label:e("profileDefaultTabs.tab1"),path:"/profile"},{label:e("profileDefaultTabs.tab2"),path:"/profile/addresses"},{label:e("profileDefaultTabs.tab3"),path:"/profile/order-history"},{label:e("profileDefaultTabs.tab4"),path:"/profile/settings"},{label:e("profileDefaultTabs.tab5"),path:"/profile/getHelp"},{label:e("profileDefaultTabs.tab6"),path:"/profile/customerTicket"}];return t?[...r.slice(0,3),{label:"Favorites",path:"/profile/favorites"},{label:"Vouchers",path:"/profile/vouchers"},{label:"Wallet",path:"/profile/wallet"},{label:"Membership",path:"/profile/membership"},{label:"Referral",path:"/profile/referral"},...r.slice(3)]:r},p=[{value:1,emoji:"\uD83D\uDE16",label:"Horrible"},{value:2,emoji:"\uD83D\uDE41",label:"Bad"},{value:3,emoji:"\uD83D\uDE10",label:"Meh"},{value:4,emoji:"\uD83D\uDE42",label:"Good"},{value:5,emoji:"\uD83D\uDE04",label:"Awesome"}],f=["Courier_Professionalism","Estimate","Delivery_on_time"]},46035:(e,t,r)=>{r.d(t,{A:()=>o});var a=r(12115),i=r(88904);function o(){let e=(0,a.useContext)(i.Ay);if(!e)throw Error("useUser must be used within a UserProvider");let t=e.updateItemQuantity;return{...e,updateItemQuantity:(e,r)=>t(e,r>0?r:-1)}}},49374:(e,t,r)=>{r.r(t),r.d(t,{FALLBACK_IMAGE_SRC:()=>u,default:()=>p});var a=r(12115),i=r(5772),o=r(56788);let n=/^\/media\/[^/?#]+/i,d=/^public-media\/(.+)$/i,l=/^(https?:|data:|blob:)/i,s=/^[a-z0-9.-]+\.[a-z]{2,}(?:\/|$|\?)/i;function c(e,t){try{return new URL(e,t).toString()}catch{return e}}let u="/assets/images/png/freshGroceries.jpg";function p(e){let{mode:t}=(0,o.q)(),r=(0,o.LT)(t).restUrl,p=(0,a.useMemo)(()=>"string"==typeof e.src?function(e,t=""){let r=e.trim();if(!r)return r;let a=r.match(d);if(a){let e=`/media/${a[1]}`;return t?c(e,t):e}if(l.test(r)){if(!t||!/^https?:/i.test(r))return r;try{let e=new URL(r);if(!n.test(e.pathname))return r;return c(`${e.pathname}${e.search}`,t)}catch{return r}}return s.test(r)?`https://${r}`:n.test(r)&&t?c(r,t):r.startsWith("/")?r:t?c(r,t):`/${r.replace(/^\/+/,"")}`}(e.src,r):e.src,[r,e.src]),[f,m]=(0,a.useState)(p),v=(0,a.useRef)(p);return(0,a.useEffect)(()=>{v.current=p,m(p)},[p]),(0,a.createElement)(i.default,{...e,key:"string"==typeof f?f:f&&"object"==typeof f&&"src"in f?f.src:String(f),src:f,unoptimized:e.unoptimized??("string"==typeof f&&(f.startsWith("blob:")||f.startsWith("data:"))),onError:t=>{e.onError?.(t),f!==v.current||"string"!=typeof f||f===u||f.startsWith("blob:")||f.startsWith("data:")||m(u)}})}},51996:(e,t,r)=>{r.d(t,{vC:()=>i});var a=r(16763);let i=`subscription OrderStatusChanged($userId:String!){
    orderStatusChanged(userId:$userId){
      userId
      origin
      order{
        _id
      orderId
      restaurant{
        _id
        name
        image
        slug
        shopType
        address
        location {
          coordinates
        }
      }
      deliveryAddress{
        location{coordinates}
        deliveryAddress
      }
      items{
        _id
        title
        food
        description
        quantity
        variation{
          _id
          title
          price
          discounted
        }
        addons{
          _id
          options{
            _id
            title
            description
            price
          }
          title
          description
          quantityMinimum
          quantityMaximum
        }
      }
      user{
        _id
        name
        phone
      }
      rider{
        _id
        name
      }
      review{
        _id
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      deliveryCharges
      tipping
      taxationAmount
      orderDate
      expectedTime
      isPickedUp
      createdAt
      completionTime
      preparationTime
      acceptedAt
      assignedAt
      pickedAt
      deliveredAt
      cancelledAt
      eta {
        phase source readyAt baseArrivalAt estimatedArrivalAt
        windowStartAt windowEndAt durationSeconds distanceMeters
        encodedPolyline calculatedAt lastLocationAt version
      }
      }
    }
  }`;(0,a.J1)`
  subscription SubscriptionOrder($id: String!) {
    subscriptionOrder(id: $id) {
      _id
      orderStatus
      rider {
        _id
      }
      completionTime
      preparationTime
      isPickedUp
      acceptedAt
      assignedAt
      pickedAt
      deliveredAt
      cancelledAt
      eta {
        phase source readyAt baseArrivalAt estimatedArrivalAt
        windowStartAt windowEndAt durationSeconds distanceMeters
        encodedPolyline
        origin { latitude longitude }
        destination { latitude longitude }
        calculatedAt lastLocationAt version
      }
    }
  }
`,(0,a.J1)`
  subscription SubscriptionOrderTracking($id: String!) {
    subscriptionOrderTracking(id: $id) {
      orderId
      status
      riderLocation {
        latitude
        longitude
        accuracy
        heading
        speed
        recordedAt
      }
      eta {
        phase source readyAt baseArrivalAt estimatedArrivalAt
        windowStartAt windowEndAt durationSeconds distanceMeters
        encodedPolyline
        origin { latitude longitude }
        destination { latitude longitude }
        calculatedAt lastLocationAt version
      }
    }
  }
`},52152:(e,t,r)=>{r.d(t,{S2:()=>p,UK:()=>f});var a=r(95155),i=r(15383),o=r(47211),n=r(12115),d=r(56788),l=r(16771),s=r(87358);let c=n.createContext({}),u=/^[a-zA-Z0-9-]+\.apps\.googleusercontent\.com$/,p=({children:e})=>{let{mode:t,isSingleVendor:r}=(0,d.q)(),n=(0,d.LT)(t),p=(0,o.IT)(i.uD,{context:r?{appMode:d.Pg.MULTI}:void 0}),f=(0,o.IT)(l.Hp,{skip:!r}),m=p.loading||p.error||!p.data?.configuration?{currency:"",currencySymbol:"",deliveryRate:0,costType:"perKM"}:p.data.configuration,v=r&&f.data?.configuration||m,g="545417768480-4l1rmpk3iq7jcsga2bi8jk0o6d1uqq6p.apps.googleusercontent.com",y=u.test(g??"")?g:"not_found",b=v.publishableKey,h=m.clientId,_=s.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY??"",I=m.webAmplitudeApiKey,C={GOOGLE:m.googleColor},x=m.webSentryUrl,A=v.currency||"XOF",k=v.currencySymbol||"FCFA",S=v.deliveryRate,w=v.costType,T=m.testOtp,E=m?.firebaseKey,P=m?.projectId,U=m?.storageBucket,$=m?.msgSenderId,O=m?.appId,q=m?.measurementId,F=m?.vapidKey,M=m?.authDomain,N=n.restUrl;return(0,a.jsx)(c.Provider,{value:{GOOGLE_CLIENT_ID:y,STRIPE_PUBLIC_KEY:b,PAYPAL_KEY:h,GOOGLE_MAPS_KEY:_,AMPLITUDE_API_KEY:I,LIBRARIES:"places,drawing,geometry".split(","),COLORS:C,SENTRY_DSN:x,SKIP_EMAIL_VERIFICATION:!0,SKIP_MOBILE_VERIFICATION:!0,CURRENCY:A,CURRENCY_SYMBOL:k,DELIVERY_RATE:S,COST_TYPE:w,TEST_OTP:T,SERVER_URL:N,FIREBASE_KEY:E,FIREBASE_APP_ID:O,FIREBASE_VAPID_KEY:F,FIREBASE_MEASUREMENT_ID:q,FIREBASE_MSG_SENDER_ID:$,FIREBASE_PROJECT_ID:P,FIREBASE_STORAGE_BUCKET:U,FIREBASE_AUTH_DOMAIN:M},children:e})};c.Consumer;let f=()=>(0,n.useContext)(c)},70408:(e,t,r)=>{function a(e=[]){return e.map(e=>({_id:e._id,options:e.options.map(e=>e._id)}))}function i(e=[]){return e.flatMap(e=>e.options.map(t=>`${e._id}:${t._id}`)).sort().join("|")}function o(e,t,r,a=[]){return e._id===t&&e.variation._id===r&&i(e.addons)===i(a)}function n(e){if(null==e||""===e)return null;let t=Number(e);return Number.isFinite(t)?Math.max(t,0):null}function d(e){let t=n(e.quantity)??0,r=n(e.actualUnitPrice)??n(e.unitPrice)??0,a=n(e.discountedUnitPrice)??r,i=n(e.actualItemTotal),o=n(e.discountedItemTotal)??n(e.itemTotal);return{actualUnitPrice:t>0&&null!==i?i/t:r,discountedUnitPrice:t>0&&null!==o?o/t:a}}r.d(t,{$F:()=>o,HG:()=>d,wm:()=>a})},88904:(e,t,r)=>{r.d(t,{Ay:()=>I,vu:()=>_});var a=r(95155),i=r(18761),o=r(35036),n=r(51996),d=r(16763),l=r(99807),s=r(34080),c=r(43597),u=r(12115),p=r(98825),f=r(68715),m=r(56788),v=r(70408),g=r(16771);let y=(0,d.J1)`
  ${n.vC}
`,b=(0,d.J1)`
  ${o.E4}
`,h=(0,u.createContext)({}),_=e=>{let{isSingleVendor:t}=(0,m.q)(),[r,o]=(0,u.useState)(!0),n=(0,l.m)(),[d,_]=(0,u.useState)((0,f.iD)()),[I,C]=(0,u.useState)([]),[x,A]=(0,u.useState)(null),[k]=(0,s.n)(b,{onError:W}),S=(0,u.useCallback)(e=>(e?.foods??[]).flatMap(e=>(e.variations??[]).map(t=>{let r=(0,v.HG)(t);return{key:t._id||`${e.foodId}-${t.variationId}`,_id:e.foodId,image:e.foodImage||"",quantity:Number(t.quantity)||0,variation:{_id:t.variationId},title:e.foodTitle,foodTitle:e.foodTitle,variationTitle:t.variationTitle,price:r.discountedUnitPrice,actualUnitPrice:r.actualUnitPrice,discountedUnitPrice:r.discountedUnitPrice,dealInfo:t.dealInfo,categoryId:e.categoryId,optionTitles:(t.addons??[]).map(e=>e.title).filter(Boolean),addons:(t.addons??[]).map(e=>({_id:e.addonId,options:[{_id:e.optionId,title:e.title}]}))}})),[]),[w]=(0,c._)(g.dV,{fetchPolicy:"network-only",onCompleted:e=>C(S(e?.getUserCart))}),[T]=(0,s.n)(g.$_,{onCompleted:e=>C(S(e?.userCartData))}),[E]=(0,s.n)(g.lb),[P]=(0,s.n)(g.f1),[U,{called:$,loading:O,error:q,data:F}]=(0,c._)(t?g.yZ:i.p6,{fetchPolicy:"cache-and-network",onCompleted:function(e){e.profile&&ed()},onError:W}),[M,{called:N,loading:j,error:D,data:L,networkStatus:B,fetchMore:R,subscribeToMore:z}]=(0,c._)(t?g.pU:i.gf,{variables:{page:1,limit:300},fetchPolicy:"cache-and-network",onError:W}),J=(0,u.useCallback)((e,t)=>{if(!t||!e.length)return e;let r=t.categories?t.categories.flatMap(e=>e.foods):[],{addons:a,options:i}=t;return r.length&&a&&i?e.map(e=>{let t=r.find(t=>t._id===e._id);if(!t)return e;let o=t.variations.find(t=>t._id===e.variation._id);if(!o)return e;let n=t.title,d=o.title,l=`${n}(${d})`,s=o.price,c=[];return e.addons&&e.addons.length>0&&e.addons.forEach(e=>{a.find(t=>t._id===e._id)&&e.options.forEach(e=>{let t=i.find(t=>t._id===e._id);t&&(s+=t.price,t.title&&c.push(t.title))})}),{...e,foodTitle:n,variationTitle:d,title:l,optionTitles:c,price:s.toFixed(2)}}):e},[]),K=(0,u.useCallback)(async e=>{if(!e)return;o(!0);let r=(0,f.iD)()||null;_(r),r&&(await U(),await M(),t&&await w()),o(!1)},[U,M,w,t]),G=(0,u.useCallback)(async e=>{A(e),m.vi.set("restaurant",e)},[]);function W(e){console.log("error",e.message)}(0,u.useEffect)(()=>{{let e=m.vi.get("restaurant"),t=m.vi.get("cartItems");if(e&&A(e),t)try{C(JSON.parse(t))}catch(e){console.error("Error parsing cart items from localStorage:",e),C([])}}o(!1)},[]),(0,u.useEffect)(()=>(K(!0),()=>{}),[d,K]);let V=(0,u.useCallback)(async(e,t=()=>{})=>{_(e),m.vi.set("token",e),t()},[]),H=(0,u.useCallback)(async()=>{try{(0,f.Lr)(),C([]),A(null),_(null),await n.resetStore()}catch(e){console.log("error on logout",e)}},[n]),Q=(0,u.useCallback)(()=>{if(z&&F?.profile?._id)try{let e=z({document:t?g.Wf:y,variables:{userId:F.profile._id},updateQuery:(e,{subscriptionData:r})=>{if(!r.data)return e;let a=t?r.data.orderStatusChanged.rawOrder:r.data.orderStatusChanged.order,{_id:i}=a;if(t){let t=e?.getUsersActiveOrders??[],r=0>t.findIndex(e=>e._id===i)?[a,...t]:t.map(e=>e._id===i?{...e,...a}:e);return{...e,getUsersActiveOrders:r}}if("new"===r.data.orderStatusChanged.origin)return(e?.orders||[])?.findIndex(e=>e._id===i)>-1?e:{orders:[r.data.orderStatusChanged.order,...e.orders||[]]};{let{orders:t}=e,a=[...t||[]],o=a.findIndex(e=>e._id===i);if(o>-1){let e=r.data.orderStatusChanged.order;a[o]={...a[o],...e,restaurant:{...a[o].restaurant,...e.restaurant}}}return{orders:[...a]}}}});n.onResetStore(()=>(e(),Promise.resolve()))}catch(e){console.log("error subscribing order",e.message)}},[n,F,t,z]);(0,u.useEffect)(()=>{F&&Q()},[F,Q]);let X=(0,u.useCallback)(()=>{if(7===B&&R){if(t)return void R({variables:{page:Math.floor((L?.getUsersActiveOrders?.length??0)/20)+1,limit:20},updateQuery:(e,{fetchMoreResult:t})=>({...e,getUsersActiveOrders:[...e.getUsersActiveOrders??[],...t?.getUsersActiveOrders??[]]})});R({variables:{offset:L?.orders?.length+1||0},updateQuery:(e,{fetchMoreResult:t})=>t&&0!==t.orders.length?{orders:e.orders.concat(t.orders)}:e})}},[L,R,t,B]),Z=(0,u.useCallback)(()=>{C([]),A(null),m.vi.remove("cartItems"),m.vi.remove("restaurant"),t&&P()},[P,t]),Y=(0,u.useCallback)(async(e,t=1)=>{C(r=>{let a=[...r],i=a.findIndex(t=>t.key===e);return -1!==i&&(a[i].quantity=a[i].quantity+t,m.vi.set("cartItems",JSON.stringify(a))),a})},[]),ee=(0,u.useCallback)(async e=>{C(t=>{let r=[...t],a=r.findIndex(t=>t.key===e);if(a>-1){r.splice(a,1);let e=r.filter(e=>e.quantity>0);return 0===e.length?(m.vi.remove("cartItems"),m.vi.remove("restaurant"),A(null)):m.vi.set("cartItems",JSON.stringify(e)),e}return r})},[]),et=(0,u.useCallback)(async e=>{C(t=>{let r=[...t],a=r.findIndex(t=>t.key===e);if(-1===a)return t;r[a].quantity=r[a].quantity-1;let i=r.filter(e=>e.quantity>0);return 0===i.length?(m.vi.remove("cartItems"),m.vi.remove("restaurant"),A(null)):m.vi.set("cartItems",JSON.stringify(i)),i})},[]),er=(0,u.useCallback)(e=>{let t=I.findIndex(t=>t._id===e);return t<0?{exist:!1,quantity:0}:{exist:!0,quantity:I[t].quantity,key:I[t].key}},[I]),ea=(0,u.useCallback)(()=>I.map(e=>e.quantity).reduce((e,t)=>e+t,0),[I]),ei=(0,u.useCallback)(async(e,r,a,i,o=1,n=[],d="")=>{if(t)return void T({variables:{input:{food:[{_id:r,categoryId:i||"",variation:{_id:a,addons:(0,v.wm)(n),count:o}}]}}});let l=!!(i&&x!==i),s={image:e,key:(0,p.A)(),_id:r,quantity:o,variation:{_id:a},addons:n,specialInstructions:d};await G(i),C(e=>{let t=[...l?[]:[...e],s];return m.vi.set("cartItems",JSON.stringify(t)),t})},[t,x,G,T]),eo=(0,u.useCallback)(async e=>{if(!t)return;let r=Math.max(0,Math.floor(e.quantity)),a=I.find(t=>(0,v.$F)(t,e.foodId,e.variationId,e.addons));C(t=>{let a=t.findIndex(t=>(0,v.$F)(t,e.foodId,e.variationId,e.addons));return 0===r?t.filter((e,t)=>t!==a):a>=0?t.map((e,t)=>t===a?{...e,quantity:r}:e):[...t,{key:`optimistic:${e.foodId}:${e.variationId}`,_id:e.foodId,variation:{_id:e.variationId},quantity:r,categoryId:e.categoryId,image:e.image??"",title:e.foodTitle,foodTitle:e.foodTitle,variationTitle:e.variationTitle,price:e.unitPrice,addons:e.addons??[]}]});try{if(a&&!a.key.startsWith("optimistic:")){let t=await E({variables:{input:{variation_id:a.key,foodId:e.foodId,categoryId:e.categoryId||a.categoryId,variationId:e.variationId,action:0===r?"delete":r>a.quantity?"increase":"decrease",count:r}}});if(!t.data?.updateUserCartCount?.success)throw Error(t.data?.updateUserCartCount?.message||"Unable to update cart")}else if(r>0){let t=await T({variables:{input:{food:[{_id:e.foodId,categoryId:e.categoryId,variation:{_id:e.variationId,addons:(0,v.wm)(e.addons),count:r}}]}}});if(!t.data?.userCartData?.success)throw Error(t.data?.userCartData?.message||"Unable to update cart")}}catch(e){throw await w(),e}},[I,w,t,T,E]),en=(0,u.useCallback)(async e=>{JSON.stringify(I)!==JSON.stringify(e)&&(C(e),m.vi.set("cartItems",JSON.stringify(e)))},[I]),ed=(0,u.useCallback)(()=>{{let e=m.vi.get("messaging-token");e&&k({variables:{token:e}})}},[k]),el=(0,u.useCallback)(async(e,r)=>{let a=r>0?1:-1;if(t){let t=I.find(t=>t.key===e);if(!t?.categoryId)return;try{await eo({foodId:t._id,categoryId:t.categoryId,variationId:t.variation._id,quantity:Math.max(0,t.quantity+a),image:t.image,foodTitle:t.foodTitle||t.title,variationTitle:t.variationTitle,unitPrice:Number(t.price)||0,addons:t.addons})}catch(e){console.error("Unable to update Single Vendor cart item",e)}return}let i=!1;C(t=>{if(i)return t;let r=[...t],o=r.findIndex(t=>t.key===e);if(-1===o)return t;let n=r[o],d=n.quantity;return console.log(`[UserContext] Current quantity for ${e}: ${d}`),a<0&&d<=1?r.splice(o,1):r[o]={...n,quantity:d+a},i=!0,0===r.length?(m.vi.remove("cartItems"),m.vi.remove("restaurant"),A(null)):m.vi.set("cartItems",JSON.stringify(r)),r})},[I,t,eo]),es=(0,u.useCallback)(async e=>{await ee(e)},[ee]),ec=(0,u.useCallback)(()=>I.reduce((e,t)=>{let r=t.variation?.price??t.price??0;return e+("string"==typeof r?parseFloat(r):r)*(t.quantity??0)},0).toFixed(2),[I]),eu=(0,u.useMemo)(()=>({isLoggedIn:!!d,loadingProfile:O&&$,errorProfile:q,profile:F&&F.profile?F.profile:null,fetchProfile:U,setTokenAsync:V,logout:H,loadingOrders:j&&N,errorOrders:D,orders:t?L?.getUsersActiveOrders??[]:L?.orders??[],fetchOrders:M,fetchMoreOrdersFunc:X,networkStatusOrders:B,cart:I,cartCount:ea(),clearCart:Z,updateCart:en,addQuantity:Y,removeQuantity:et,addItem:ei,checkItemCart:er,deleteItem:ee,restaurant:x,setCartRestaurant:G,isLoading:r,updateItemQuantity:el,removeItem:es,calculateSubtotal:ec,transformCartWithFoodInfo:J,setCart:C,setSingleVendorItemQuantity:eo}),[d,O,$,q,F,U,V,H,j,N,D,L,M,X,B,I,ea,Z,en,Y,et,ei,er,ee,x,G,r,el,es,ec,J,C,eo]);return(0,a.jsx)(h.Provider,{value:eu,children:e.children})};h.Consumer;let I=h}}]);