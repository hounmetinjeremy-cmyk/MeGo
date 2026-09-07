(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8387],{46035:(e,t,r)=>{"use strict";r.d(t,{A:()=>n});var a=r(12115),i=r(88904);function n(){let e=(0,a.useContext)(i.Ay);if(!e)throw Error("useUser must be used within a UserProvider");let t=e.updateItemQuantity;return{...e,updateItemQuantity:(e,r)=>t(e,r>0?r:-1)}}},51996:(e,t,r)=>{"use strict";r.d(t,{vC:()=>i});var a=r(16763);let i=`subscription OrderStatusChanged($userId:String!){
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
`},57307:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>g});var a=r(95155),i=r(18761),n=r(46035),o=r(53640),d=r(99807),s=r(73321),l=r(12115),u=r(56788),c=r(16771);let f="pending_stripe_order_id",m="pending_stripe_started_at";function p(){let e=(0,s.useRouter)(),t=(0,s.useSearchParams)(),r=(0,d.m)(),{clearCart:p}=(0,n.A)(),{isSingleVendor:g}=(0,u.q)(),[y,v]=(0,l.useState)(!1),h=(0,l.useRef)(!1),b=(0,l.useMemo)(()=>{let e=t.get("id")||t.get("orderId")||t.get("reference");return e?(localStorage.setItem(f,e),localStorage.setItem(m,Date.now().toString()),e):localStorage.getItem(f)||""},[t]),I=(0,l.useCallback)(()=>{localStorage.removeItem(f),localStorage.removeItem(m)},[]),_=(0,l.useCallback)(async()=>{await p(),(0,o.p)("delete","applied_coupon"),(0,o.p)("delete","coupon_text"),(0,o.p)("delete","is_coupon_applied"),(0,o.p)("delete","coupon_restaurant_id"),I()},[p,I]),w=(0,l.useCallback)(async t=>{!h.current&&t?._id&&(h.current=!0,await _(),e.replace(`/order/${g?t.orderId:t._id}/tracking`))},[_,g,e]),k=(0,l.useCallback)(async()=>{if(!b)return null;try{let e=await r.query({query:g?c.pU:i.gf,variables:{page:1,limit:300},fetchPolicy:"network-only"});return(g?e.data.getUsersActiveOrders??[]:e.data?.orders??[]).find(e=>e.orderId===b||e._id===b)||null}catch{return null}},[r,g,b]);return(0,l.useEffect)(()=>{if(!b)return void v(!0);let e=!0;return(async()=>{let t=Number(localStorage.getItem(m))||Date.now();for(;e&&!h.current;){let r=await k();if(r)return void await w(r);if(Date.now()-t>=6e4){e&&v(!0);return}await new Promise(e=>setTimeout(e,3e3))}})(),()=>{e=!1}},[w,k,b]),(0,a.jsx)("div",{className:"min-h-[70vh] flex items-center justify-center px-6 py-16",children:(0,a.jsxs)("div",{className:"w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm",children:[(0,a.jsx)("div",{className:"mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-color"}),(0,a.jsx)("h1",{className:"text-2xl font-semibold text-neutral-900",children:y?"Payment submitted":"Confirming your order"}),(0,a.jsx)("p",{className:"mt-3 text-sm text-neutral-600",children:y?"Your payment was submitted successfully. We're still waiting for the backend confirmation, so your order may appear in a moment.":"Your card payment was submitted. We're waiting for the backend to confirm the order before sending you to tracking."}),b?(0,a.jsxs)("p",{className:"mt-4 text-xs text-neutral-400",children:["Reference: ",b]}):null,y?(0,a.jsxs)("div",{className:"mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center",children:[(0,a.jsx)("button",{className:"rounded-full bg-primary-color px-5 py-3 text-sm font-medium text-white",onClick:()=>e.push("/profile/order-history"),children:"View my orders"}),(0,a.jsx)("button",{className:"rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-700",onClick:()=>e.push("/"),children:"Continue browsing"})]}):null]})})}function g(){return(0,a.jsx)(p,{})}},70408:(e,t,r)=>{"use strict";function a(e=[]){return e.map(e=>({_id:e._id,options:e.options.map(e=>e._id)}))}function i(e=[]){return e.flatMap(e=>e.options.map(t=>`${e._id}:${t._id}`)).sort().join("|")}function n(e,t,r,a=[]){return e._id===t&&e.variation._id===r&&i(e.addons)===i(a)}function o(e){if(null==e||""===e)return null;let t=Number(e);return Number.isFinite(t)?Math.max(t,0):null}function d(e){let t=o(e.quantity)??0,r=o(e.actualUnitPrice)??o(e.unitPrice)??0,a=o(e.discountedUnitPrice)??r,i=o(e.actualItemTotal),n=o(e.discountedItemTotal)??o(e.itemTotal);return{actualUnitPrice:t>0&&null!==i?i/t:r,discountedUnitPrice:t>0&&null!==n?n/t:a}}r.d(t,{$F:()=>n,HG:()=>d,wm:()=>a})},73321:(e,t,r)=>{"use strict";var a=r(74645);r.o(a,"useParams")&&r.d(t,{useParams:function(){return a.useParams}}),r.o(a,"usePathname")&&r.d(t,{usePathname:function(){return a.usePathname}}),r.o(a,"useRouter")&&r.d(t,{useRouter:function(){return a.useRouter}}),r.o(a,"useSearchParams")&&r.d(t,{useSearchParams:function(){return a.useSearchParams}})},78906:(e,t,r)=>{Promise.resolve().then(r.bind(r,57307))},88904:(e,t,r)=>{"use strict";r.d(t,{Ay:()=>_,vu:()=>I});var a=r(95155),i=r(18761),n=r(35036),o=r(51996),d=r(16763),s=r(99807),l=r(34080),u=r(43597),c=r(12115),f=r(98825),m=r(68715),p=r(56788),g=r(70408),y=r(16771);let v=(0,d.J1)`
  ${o.vC}
`,h=(0,d.J1)`
  ${n.E4}
`,b=(0,c.createContext)({}),I=e=>{let{isSingleVendor:t}=(0,p.q)(),[r,n]=(0,c.useState)(!0),o=(0,s.m)(),[d,I]=(0,c.useState)((0,m.iD)()),[_,w]=(0,c.useState)([]),[k,A]=(0,c.useState)(null),[C]=(0,l.n)(h,{onError:H}),x=(0,c.useCallback)(e=>(e?.foods??[]).flatMap(e=>(e.variations??[]).map(t=>{let r=(0,g.HG)(t);return{key:t._id||`${e.foodId}-${t.variationId}`,_id:e.foodId,image:e.foodImage||"",quantity:Number(t.quantity)||0,variation:{_id:t.variationId},title:e.foodTitle,foodTitle:e.foodTitle,variationTitle:t.variationTitle,price:r.discountedUnitPrice,actualUnitPrice:r.actualUnitPrice,discountedUnitPrice:r.discountedUnitPrice,dealInfo:t.dealInfo,categoryId:e.categoryId,optionTitles:(t.addons??[]).map(e=>e.title).filter(Boolean),addons:(t.addons??[]).map(e=>({_id:e.addonId,options:[{_id:e.optionId,title:e.title}]}))}})),[]),[S]=(0,u._)(y.dV,{fetchPolicy:"network-only",onCompleted:e=>w(x(e?.getUserCart))}),[P]=(0,l.n)(y.$_,{onCompleted:e=>w(x(e?.userCartData))}),[U]=(0,l.n)(y.lb),[q]=(0,l.n)(y.f1),[T,{called:N,loading:O,error:$,data:E}]=(0,u._)(t?y.yZ:i.p6,{fetchPolicy:"cache-and-network",onCompleted:function(e){e.profile&&ed()},onError:H}),[M,{called:j,loading:J,error:D,data:R,networkStatus:F,fetchMore:L,subscribeToMore:V}]=(0,u._)(t?y.pU:i.gf,{variables:{page:1,limit:300},fetchPolicy:"cache-and-network",onError:H}),Q=(0,c.useCallback)((e,t)=>{if(!t||!e.length)return e;let r=t.categories?t.categories.flatMap(e=>e.foods):[],{addons:a,options:i}=t;return r.length&&a&&i?e.map(e=>{let t=r.find(t=>t._id===e._id);if(!t)return e;let n=t.variations.find(t=>t._id===e.variation._id);if(!n)return e;let o=t.title,d=n.title,s=`${o}(${d})`,l=n.price,u=[];return e.addons&&e.addons.length>0&&e.addons.forEach(e=>{a.find(t=>t._id===e._id)&&e.options.forEach(e=>{let t=i.find(t=>t._id===e._id);t&&(l+=t.price,t.title&&u.push(t.title))})}),{...e,foodTitle:o,variationTitle:d,title:s,optionTitles:u,price:l.toFixed(2)}}):e},[]),W=(0,c.useCallback)(async e=>{if(!e)return;n(!0);let r=(0,m.iD)()||null;I(r),r&&(await T(),await M(),t&&await S()),n(!1)},[T,M,S,t]),G=(0,c.useCallback)(async e=>{A(e),p.vi.set("restaurant",e)},[]);function H(e){console.log("error",e.message)}(0,c.useEffect)(()=>{{let e=p.vi.get("restaurant"),t=p.vi.get("cartItems");if(e&&A(e),t)try{w(JSON.parse(t))}catch(e){console.error("Error parsing cart items from localStorage:",e),w([])}}n(!1)},[]),(0,c.useEffect)(()=>(W(!0),()=>{}),[d,W]);let Y=(0,c.useCallback)(async(e,t=()=>{})=>{I(e),p.vi.set("token",e),t()},[]),B=(0,c.useCallback)(async()=>{try{(0,m.Lr)(),w([]),A(null),I(null),await o.resetStore()}catch(e){console.log("error on logout",e)}},[o]),Z=(0,c.useCallback)(()=>{if(V&&E?.profile?._id)try{let e=V({document:t?y.Wf:v,variables:{userId:E.profile._id},updateQuery:(e,{subscriptionData:r})=>{if(!r.data)return e;let a=t?r.data.orderStatusChanged.rawOrder:r.data.orderStatusChanged.order,{_id:i}=a;if(t){let t=e?.getUsersActiveOrders??[],r=0>t.findIndex(e=>e._id===i)?[a,...t]:t.map(e=>e._id===i?{...e,...a}:e);return{...e,getUsersActiveOrders:r}}if("new"===r.data.orderStatusChanged.origin)return(e?.orders||[])?.findIndex(e=>e._id===i)>-1?e:{orders:[r.data.orderStatusChanged.order,...e.orders||[]]};{let{orders:t}=e,a=[...t||[]],n=a.findIndex(e=>e._id===i);if(n>-1){let e=r.data.orderStatusChanged.order;a[n]={...a[n],...e,restaurant:{...a[n].restaurant,...e.restaurant}}}return{orders:[...a]}}}});o.onResetStore(()=>(e(),Promise.resolve()))}catch(e){console.log("error subscribing order",e.message)}},[o,E,t,V]);(0,c.useEffect)(()=>{E&&Z()},[E,Z]);let z=(0,c.useCallback)(()=>{if(7===F&&L){if(t)return void L({variables:{page:Math.floor((R?.getUsersActiveOrders?.length??0)/20)+1,limit:20},updateQuery:(e,{fetchMoreResult:t})=>({...e,getUsersActiveOrders:[...e.getUsersActiveOrders??[],...t?.getUsersActiveOrders??[]]})});L({variables:{offset:R?.orders?.length+1||0},updateQuery:(e,{fetchMoreResult:t})=>t&&0!==t.orders.length?{orders:e.orders.concat(t.orders)}:e})}},[R,L,t,F]),K=(0,c.useCallback)(()=>{w([]),A(null),p.vi.remove("cartItems"),p.vi.remove("restaurant"),t&&q()},[q,t]),X=(0,c.useCallback)(async(e,t=1)=>{w(r=>{let a=[...r],i=a.findIndex(t=>t.key===e);return -1!==i&&(a[i].quantity=a[i].quantity+t,p.vi.set("cartItems",JSON.stringify(a))),a})},[]),ee=(0,c.useCallback)(async e=>{w(t=>{let r=[...t],a=r.findIndex(t=>t.key===e);if(a>-1){r.splice(a,1);let e=r.filter(e=>e.quantity>0);return 0===e.length?(p.vi.remove("cartItems"),p.vi.remove("restaurant"),A(null)):p.vi.set("cartItems",JSON.stringify(e)),e}return r})},[]),et=(0,c.useCallback)(async e=>{w(t=>{let r=[...t],a=r.findIndex(t=>t.key===e);if(-1===a)return t;r[a].quantity=r[a].quantity-1;let i=r.filter(e=>e.quantity>0);return 0===i.length?(p.vi.remove("cartItems"),p.vi.remove("restaurant"),A(null)):p.vi.set("cartItems",JSON.stringify(i)),i})},[]),er=(0,c.useCallback)(e=>{let t=_.findIndex(t=>t._id===e);return t<0?{exist:!1,quantity:0}:{exist:!0,quantity:_[t].quantity,key:_[t].key}},[_]),ea=(0,c.useCallback)(()=>_.map(e=>e.quantity).reduce((e,t)=>e+t,0),[_]),ei=(0,c.useCallback)(async(e,r,a,i,n=1,o=[],d="")=>{if(t)return void P({variables:{input:{food:[{_id:r,categoryId:i||"",variation:{_id:a,addons:(0,g.wm)(o),count:n}}]}}});let s=!!(i&&k!==i),l={image:e,key:(0,f.A)(),_id:r,quantity:n,variation:{_id:a},addons:o,specialInstructions:d};await G(i),w(e=>{let t=[...s?[]:[...e],l];return p.vi.set("cartItems",JSON.stringify(t)),t})},[t,k,G,P]),en=(0,c.useCallback)(async e=>{if(!t)return;let r=Math.max(0,Math.floor(e.quantity)),a=_.find(t=>(0,g.$F)(t,e.foodId,e.variationId,e.addons));w(t=>{let a=t.findIndex(t=>(0,g.$F)(t,e.foodId,e.variationId,e.addons));return 0===r?t.filter((e,t)=>t!==a):a>=0?t.map((e,t)=>t===a?{...e,quantity:r}:e):[...t,{key:`optimistic:${e.foodId}:${e.variationId}`,_id:e.foodId,variation:{_id:e.variationId},quantity:r,categoryId:e.categoryId,image:e.image??"",title:e.foodTitle,foodTitle:e.foodTitle,variationTitle:e.variationTitle,price:e.unitPrice,addons:e.addons??[]}]});try{if(a&&!a.key.startsWith("optimistic:")){let t=await U({variables:{input:{variation_id:a.key,foodId:e.foodId,categoryId:e.categoryId||a.categoryId,variationId:e.variationId,action:0===r?"delete":r>a.quantity?"increase":"decrease",count:r}}});if(!t.data?.updateUserCartCount?.success)throw Error(t.data?.updateUserCartCount?.message||"Unable to update cart")}else if(r>0){let t=await P({variables:{input:{food:[{_id:e.foodId,categoryId:e.categoryId,variation:{_id:e.variationId,addons:(0,g.wm)(e.addons),count:r}}]}}});if(!t.data?.userCartData?.success)throw Error(t.data?.userCartData?.message||"Unable to update cart")}}catch(e){throw await S(),e}},[_,S,t,P,U]),eo=(0,c.useCallback)(async e=>{JSON.stringify(_)!==JSON.stringify(e)&&(w(e),p.vi.set("cartItems",JSON.stringify(e)))},[_]),ed=(0,c.useCallback)(()=>{{let e=p.vi.get("messaging-token");e&&C({variables:{token:e}})}},[C]),es=(0,c.useCallback)(async(e,r)=>{let a=r>0?1:-1;if(t){let t=_.find(t=>t.key===e);if(!t?.categoryId)return;try{await en({foodId:t._id,categoryId:t.categoryId,variationId:t.variation._id,quantity:Math.max(0,t.quantity+a),image:t.image,foodTitle:t.foodTitle||t.title,variationTitle:t.variationTitle,unitPrice:Number(t.price)||0,addons:t.addons})}catch(e){console.error("Unable to update Single Vendor cart item",e)}return}let i=!1;w(t=>{if(i)return t;let r=[...t],n=r.findIndex(t=>t.key===e);if(-1===n)return t;let o=r[n],d=o.quantity;return console.log(`[UserContext] Current quantity for ${e}: ${d}`),a<0&&d<=1?r.splice(n,1):r[n]={...o,quantity:d+a},i=!0,0===r.length?(p.vi.remove("cartItems"),p.vi.remove("restaurant"),A(null)):p.vi.set("cartItems",JSON.stringify(r)),r})},[_,t,en]),el=(0,c.useCallback)(async e=>{await ee(e)},[ee]),eu=(0,c.useCallback)(()=>_.reduce((e,t)=>{let r=t.variation?.price??t.price??0;return e+("string"==typeof r?parseFloat(r):r)*(t.quantity??0)},0).toFixed(2),[_]),ec=(0,c.useMemo)(()=>({isLoggedIn:!!d,loadingProfile:O&&N,errorProfile:$,profile:E&&E.profile?E.profile:null,fetchProfile:T,setTokenAsync:Y,logout:B,loadingOrders:J&&j,errorOrders:D,orders:t?R?.getUsersActiveOrders??[]:R?.orders??[],fetchOrders:M,fetchMoreOrdersFunc:z,networkStatusOrders:F,cart:_,cartCount:ea(),clearCart:K,updateCart:eo,addQuantity:X,removeQuantity:et,addItem:ei,checkItemCart:er,deleteItem:ee,restaurant:k,setCartRestaurant:G,isLoading:r,updateItemQuantity:es,removeItem:el,calculateSubtotal:eu,transformCartWithFoodInfo:Q,setCart:w,setSingleVendorItemQuantity:en}),[d,O,N,$,E,T,Y,B,J,j,D,R,M,z,F,_,ea,K,eo,X,et,ei,er,ee,k,G,r,es,el,eu,Q,w,en]);return(0,a.jsx)(b.Provider,{value:ec,children:e.children})};b.Consumer;let _=b},98825:(e,t,r)=>{"use strict";let a;r.d(t,{A:()=>d});let i="u">typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),n=new Uint8Array(16),o=[];for(let e=0;e<256;++e)o.push((e+256).toString(16).slice(1));let d=function(e,t,r){if(i&&!t&&!e)return i();let d=(e=e||{}).random??e.rng?.()??function(){if(!a){if("u"<typeof crypto||!crypto.getRandomValues)throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");a=crypto.getRandomValues.bind(crypto)}return a(n)}();if(d.length<16)throw Error("Random bytes length must be >= 16");if(d[6]=15&d[6]|64,d[8]=63&d[8]|128,t){if((r=r||0)<0||r+16>t.length)throw RangeError(`UUID byte range ${r}:${r+15} is out of buffer bounds`);for(let e=0;e<16;++e)t[r+e]=d[e];return t}return function(e,t=0){return(o[e[t+0]]+o[e[t+1]]+o[e[t+2]]+o[e[t+3]]+"-"+o[e[t+4]]+o[e[t+5]]+"-"+o[e[t+6]]+o[e[t+7]]+"-"+o[e[t+8]]+o[e[t+9]]+"-"+o[e[t+10]]+o[e[t+11]]+o[e[t+12]]+o[e[t+13]]+o[e[t+14]]+o[e[t+15]]).toLowerCase()}(d)}}},e=>{e.O(0,[1530,3597,2523,8441,3794,7358],()=>e(e.s=78906)),_N_E=e.O()}]);