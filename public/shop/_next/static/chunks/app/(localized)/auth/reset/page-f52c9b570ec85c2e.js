(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5472],{4532:(e,t,i)=>{"use strict";i.d(t,{ZO:()=>o,gf:()=>a,j6:()=>n});var r=i(16763);let a=(0,r.J1)`
  query Orders($page: Int, $limit: Int) {
    orders(page: $page, limit: $limit) {
      _id
      orderId
      id
      restaurant {
        _id
        name
        slug
        shopType
        image
        address
        location {
          coordinates
        }
      }
      deliveryAddress {
        location {
          coordinates
        }
        deliveryAddress
        id
      }
      items {
        _id
        id
        title
        food
        description
        quantity
        image
        variation {
          _id
          id
          title
          price
          discounted
        }
        addons {
          _id
          id
          options {
            _id
            id
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
      user {
        _id
        name
        phone
      }
      rider {
        _id
        name
        phone
      }
      review {
        _id
        rating
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      paymentStatus
      tipping
      taxationAmount
      createdAt
      completionTime
      preparationTime
      orderDate
      expectedTime
      isPickedUp
      deliveryCharges
      acceptedAt
      pickedAt
      deliveredAt
      cancelledAt
      assignedAt
      instructions
      eta {
        phase source readyAt baseArrivalAt estimatedArrivalAt
        windowStartAt windowEndAt durationSeconds distanceMeters
        encodedPolyline calculatedAt lastLocationAt version
      }
    }
  }
`,n=(0,r.J1)`
  query GetUsersPastOrders($page: Int!, $limit: Int!, $offset: Int!) {
    getUsersPastOrders(page: $page, limit: $limit, offset: $offset) {
     _id
      orderId
      id
      restaurant {
        _id
        name
        slug
        shopType
        image
        address
        location {
          coordinates
        }
      }
      deliveryAddress {
        location {
          coordinates
        }
        deliveryAddress
        id
      }
      items {
        _id
        id
        title
        food
        description
        quantity
        image
        variation {
          _id
          id
          title
          price
          discounted
        }
        addons {
          _id
          id
          options {
            _id
            id
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
      user {
        _id
        name
        phone
      }
      rider {
        _id
        name
        phone
      }
      review {
        _id
        rating
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      paymentStatus
      tipping
      taxationAmount
      createdAt
      completionTime
      preparationTime
      orderDate
      expectedTime
      isPickedUp
      deliveryCharges
      acceptedAt
      pickedAt
      deliveredAt
      cancelledAt
      assignedAt
      instructions
      eta {
        phase source readyAt baseArrivalAt estimatedArrivalAt
        windowStartAt windowEndAt durationSeconds distanceMeters
        encodedPolyline calculatedAt lastLocationAt version
      }
    }
  }
`,o=(0,r.J1)`
  query GetUsersActiveOrders($page: Int!, $limit: Int!, $offset: Int!) {
    getUsersActiveOrders(page: $page, limit: $limit, offset: $offset) {
    _id
      orderId
      id
      restaurant {
        _id
        name
        slug
        shopType
        image
        address
        location {
          coordinates
        }
      }
      deliveryAddress {
        location {
          coordinates
        }
        deliveryAddress
        id
      }
      items {
        _id
        id
        title
        food
        description
        quantity
        image
        variation {
          _id
          id
          title
          price
          discounted
        }
        addons {
          _id
          id
          options {
            _id
            id
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
      user {
        _id
        name
        phone
      }
      rider {
        _id
        name
        phone
      }
      review {
        _id
        rating
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      paymentStatus
      tipping
      taxationAmount
      createdAt
      completionTime
      preparationTime
      orderDate
      expectedTime
      isPickedUp
      deliveryCharges
      acceptedAt
      pickedAt
      deliveredAt
      cancelledAt
      assignedAt
      instructions  
      eta {
        phase source readyAt baseArrivalAt estimatedArrivalAt
        windowStartAt windowEndAt durationSeconds distanceMeters
        encodedPolyline calculatedAt lastLocationAt version
      }
    }
  }
`},7362:(e,t,i)=>{"use strict";i.d(t,{E:()=>p});var r=i(12115),a=i(59218),n=i(47834),o=i(4634),s=i(43062);function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var l=n.x.extend({defaultProps:{__TYPE:"Skeleton",shape:"rectangle",size:null,width:"100%",height:"1rem",borderRadius:null,animation:"wave",style:null,className:null},css:{classes:{root:function(e){var t=e.props;return(0,s.xW)("p-skeleton p-component",{"p-skeleton-circle":"circle"===t.shape,"p-skeleton-none":"none"===t.animation})}},inlineStyles:{root:{position:"relative"}},styles:'\n@layer primereact {\n    .p-skeleton {\n        position: relative;\n        overflow: hidden;\n    }\n    \n    .p-skeleton::after {\n        content: "";\n        animation: p-skeleton-animation 1.2s infinite;\n        height: 100%;\n        left: 0;\n        position: absolute;\n        right: 0;\n        top: 0;\n        transform: translateX(-100%);\n        z-index: 1;\n    }\n    \n    .p-skeleton-circle {\n        border-radius: 50%;\n    }\n    \n    .p-skeleton-none::after {\n        animation: none;\n    }\n}\n\n@keyframes p-skeleton-animation {\n    from {\n        transform: translateX(-100%);\n    }\n    to {\n        transform: translateX(100%);\n    }\n}\n'}});function u(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,r)}return i}function c(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?u(Object(i),!0).forEach(function(t){!function(e,t,i){var r;(r=function(e,t){if("object"!=d(e)||!e)return e;var i=e[Symbol.toPrimitive];if(void 0!==i){var r=i.call(e,t||"default");if("object"!=d(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==d(r)?r:r+"")in e)?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i}(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):u(Object(i)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}var p=r.memo(r.forwardRef(function(e,t){var i=(0,o.qV)(),d=r.useContext(a.UM),u=l.getProps(e,d),p=l.setMetaData({props:u}),m=p.ptm,g=p.cx,f=p.sx,v=p.isUnstyled;(0,n.j)(l.css.styles,v,{name:"skeleton"});var y=r.useRef(null);r.useImperativeHandle(t,function(){return{props:u,getElement:function(){return y.current}}});var h=u.size?{width:u.size,height:u.size,borderRadius:u.borderRadius}:{width:u.width,height:u.height,borderRadius:u.borderRadius},b=i({ref:y,className:(0,s.xW)(u.className,g("root")),style:c(c({},h),f("root")),"aria-hidden":!0},l.getOtherProps(u),m("root"));return r.createElement("div",b)}));p.displayName="Skeleton"},9379:(e,t,i)=>{"use strict";i.d(t,{A:()=>g});var r=i(95155),a=i(79254),n=i(622),o=i(46132),s=i(36918),d=i(92584),l=i(9969),u=i(50910);function c(){let e=(0,u.c)();return(0,r.jsx)("div",{className:"mt-2 flex flex-col gap-2 ",children:s.$i.map((t,i)=>(0,r.jsxs)("div",{className:"text-gray-500 text-sm",children:[(0,r.jsx)(l.g,{icon:d.RVf,className:"mr-2"}),(0,r.jsx)("span",{children:e(t)})]},i))})}var p=i(12115),m=i(59218);function g({className:e,placeholder:t,showLabel:i,feedback:s=!0,isLoading:d=!1,...l}){let f;return f=(0,u.c)("Password"),(0,p.useEffect)(()=>{(0,m.IK)("en",{weak:f("weak"),medium:f("medium"),strong:f("strong"),passwordPrompt:f("enter_a_password")}),(0,m.Hg)("en")},[f]),d?(0,r.jsx)(o.A,{}):(0,r.jsxs)("div",{className:"flex flex-col gap-y-1 rounded-lg dark:bg-gray-800",children:[i&&(0,r.jsx)("label",{htmlFor:"username",className:"text-sm font-[500] dark:text-white",children:t}),(0,r.jsx)(a._,{className:(0,n.QP)("icon-right h-10 w-full rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white border-gray-300 border-inherit pr-8 text-sm focus:shadow-none focus:outline-none",e),inputClassName:"bg-white text-black dark:bg-gray-800 dark:text-white",panelClassName:"bg-white text-black dark:bg-gray-800 dark:text-white",placeholder:t,toggleMask:!0,feedback:s,footer:s?(0,r.jsx)(c,{}):null,...l})]})}},15383:(e,t,i)=>{"use strict";i.d(t,{pc:()=>d,Bt:()=>n,Nj:()=>f,uD:()=>a,OJ:()=>v,xz:()=>m,rw:()=>g,HC:()=>y,bg:()=>_,p6:()=>$,ZZ:()=>w,Qy:()=>p,SU:()=>o,gf:()=>b.gf,Qw:()=>c,P2:()=>s,vh:()=>h});var r=i(16763);let a=(0,r.J1)`
  query Configuration {
    configuration {
      _id
      currency
      currencySymbol
      deliveryRate
      twilioEnabled
      webClientID
      webAmplitudeApiKey
      googleMapLibraries
      googleColor
      webSentryUrl
      publishableKey
      clientId
      skipEmailVerification
      skipMobileVerification
      costType
      firebaseKey
      authDomain
      projectId
      storageBucket
      msgSenderId
      appId
    }
  }
`,n=(0,r.J1)`
  query Banners {
    banners {
      _id
      title
      description
      action
      screen
      file
      parameters
      slug
      shopType
    }
  }
`;(0,r.J1)`
  query Cuisines {
    attachedCuisines {
      _id
      name
      description
      image
      shopType
    }
  }
`;let o=(0,r.J1)`
  query RestaurantCuisines($latitude: Float, $longitude: Float, $shopType: String) {
    nearByRestaurantsCuisines(
      latitude: $latitude
      longitude: $longitude
      shopType: $shopType
    ) {
        _id
        name
        description
        image
        shopType
    }
  }
`,s=(0,r.J1)`
  query RelatedItems($itemId: String!, $restaurantId: String!) {
    relatedItems(itemId: $itemId, restaurantId: $restaurantId)
  }
`,d=(0,r.J1)`
  fragment FoodItem on Food {
    _id
    title
    image
    description
    subCategory
    isOutOfStock
    variations {
      _id
      title
      price
      discounted
      addons
    }
  }
`,l=(0,r.J1)`
  fragment RestaurantPreviewFields on RestaurantPreview {
    _id
    name
    image
    logo
    slug
    shopType
    minimumOrder
    deliveryTime
    location {
      coordinates
    }
    reviewAverage
    cuisines
    openingTimes {
      day
      times {
        startTime
        endTime
      }
    }
    isAvailable
    isActive
  }
`,u=(0,r.J1)`
  fragment RestaurantCarouselPreviewFields on RestaurantCarouselPreview {
    _id
    name
    image
    logo
    slug
    shopType
    minimumOrder
    deliveryTime
    location {
      coordinates
    }
    reviewAverage
    cuisines
    openingTimes {
      day
      times {
        startTime
        endTime
      }
    }
    isAvailable
    isActive
  }
`,c=(0,r.J1)`
  ${u}
  query GetRecentOrderRestaurants($latitude: Float!, $longitude: Float!) {
    recentOrderRestaurantsPreview(latitude: $latitude, longitude: $longitude) {
      ...RestaurantCarouselPreviewFields
    }
  }
`,p=(0,r.J1)`
  ${u}
  query GetMostOrderedRestaurants(
    $latitude: Float!
    $longitude: Float!
    $page: Int
    $limit: Int
    $shopType: String
  ) {
    mostOrderedRestaurantsPreview(
      latitude: $latitude
      longitude: $longitude
      page: $page
      limit: $limit
      shopType: $shopType
    ) {
      ...RestaurantCarouselPreviewFields
    }
  }
`;(0,r.J1)`
  ${l}
  query Restaurants(
    $latitude: Float
    $longitude: Float
    $page: Int
    $limit: Int
    $shopType: String
  ) {
    nearByRestaurantsPreview(
      latitude: $latitude
      longitude: $longitude
      page: $page
      limit: $limit
      shopType: $shopType
    ) {
      restaurants {
        ...RestaurantPreviewFields
      }
    }
  }
`;let m=(0,r.J1)`
  query RestaurantByIdAndSlug($id: String, $slug: String) {
    restaurant(id: $id, slug: $slug) {
      _id
      orderId
      orderPrefix
      isActive
      name
      image
      logo
      slug
      username
      phone
      shopType
      address
      location {
        coordinates
      }
      deliveryTime
      minimumOrder
      tax
      stripeDetailsSubmitted
      reviewData {
        total
        ratings
        reviews {
          _id
          order {
            user {
              _id
              name
              email
            }
          }
          rating
          description
          createdAt
        }
      }
      categories {
        _id
        title
        foods {
          _id
          title
          image
          description
          isOutOfStock
          subCategory
          variations {
            _id
            title
            price
            discounted
            addons
            isOutOfStock
          }
        }
      }
      options {
        _id
        title
        description
        price
        isOutOfStock
      }
      addons {
        _id
        options
        title
        description
        quantityMinimum
        quantityMaximum
      }
      zone {
        _id
        title
        tax
      }
      rating
      isAvailable
      openingTimes {
        day
        times {
          startTime
          endTime
        }
      }
    }
  }
`,g=(0,r.J1)`
  query GetReviewsByRestaurant($restaurant: String!) {
    reviewsByRestaurant(restaurant: $restaurant) {
      reviews {
        _id
        rating
        description
        comments
        isActive
        createdAt
        updatedAt
        order {
          _id
          user {
            _id
            name
            email
          }
        }
        restaurant {
          _id
          name
        }
      }
      ratings
      total
    }
  }
`,f=(0,r.J1)`
  query FetchCategoryDetailsByStoreId($storeId: String!) {
    fetchCategoryDetailsByStoreId(storeId: $storeId) {
      id
      label
      # slug
      url
      items {
        id
        label
        url
        # slug
      }
    }
  }
`,v=(0,r.J1)`
  query PopularItems($restaurantId: String!) {
    popularItems(restaurantId: $restaurantId) {
      id
      count
    }
  }
`,y=(0,r.J1)`
  query subCategories {
    subCategories {
      _id
      title
      parentCategoryId
    }
  }
`,h=(0,r.J1)`
  ${u}
  query TopRatedVendors($latitude: Float!, $longitude: Float!) {
    topRatedVendorsPreview(latitude: $latitude, longitude: $longitude) {
      ...RestaurantCarouselPreviewFields
    }
  }
`;var b=i(4532);let $=(0,r.J1)`
        query{
          profile{
            _id
            name
            phone
            phoneIsVerified
            email
            emailIsVerified
            notificationToken
            isOrderNotification
            isOfferNotification
            addresses{
              _id
              label
              deliveryAddress
              details
              location{coordinates}
              selected
            }
            favourite
          }
        }`,_=(0,r.J1)`
  query UserFavourite($latitude: Float, $longitude: Float) {
    userFavourite(latitude: $latitude, longitude: $longitude) {
      _id
      orderId
      orderPrefix
      name
      isActive
      image
      address
      slug
      shopType
      location {
        coordinates
      }
      deliveryTime
      minimumOrder
      tax
      isAvailable
      reviewCount
      reviewAverage
      reviewData {
        total
        ratings
        reviews {
          _id
          order {
            user {
              _id
              name
              email
            }
          }
          rating
          description
          createdAt
        }
      }
      categories {
        _id
        title
        foods {
          _id
          title
          image
          description
          subCategory
          variations {
            _id
            title
            price
            discounted
            addons
          }
        }
      }
      options {
        _id
        title
        description
        price
      }
      addons {
        _id
        options
        title
        description
        quantityMinimum
        quantityMaximum
      }
      rating
      openingTimes {
        day
        times {
          startTime
          endTime
        }
      }
    }
  }
`,w=(0,r.J1)`
  query Zones {
    zones {
      _id
      title
      description
      location {
        coordinates
      }
      isActive
    }
  }
`},16261:(e,t,i)=>{"use strict";i.d(t,{ED:()=>n,Iu:()=>s,Pg:()=>a,YB:()=>o,xz:()=>d});var r=i(87358);let a={MULTI:"MULTI",SINGLE:"SINGLE"},n=a.MULTI,o="@enatega/app-mode",s=()=>{let e=r.env.NEXT_PUBLIC_VENDOR_MODE?.toUpperCase();return e===a.SINGLE?a.SINGLE:e===a.MULTI?a.MULTI:null},d=e=>e===a.MULTI||e===a.SINGLE},18761:(e,t,i)=>{"use strict";i.d(t,{C3:()=>r.C3,CY:()=>r.CY,Cf:()=>r.Cf,Dw:()=>r.Dw,E4:()=>r.E4,Ec:()=>r.Ec,HC:()=>a.HC,Kk:()=>r.Kk,Nj:()=>a.Nj,OJ:()=>a.OJ,Ou:()=>r.Ou,P2:()=>a.P2,Qw:()=>a.Qw,S3:()=>r.S3,Y8:()=>r.Y8,ZZ:()=>a.ZZ,Ze:()=>r.Ze,Zh:()=>r.Zh,Zt:()=>r.Zt,bg:()=>a.bg,eq:()=>r.eq,gf:()=>a.gf,hO:()=>r.hO,ox:()=>r.ox,p6:()=>a.p6,pc:()=>a.pc,rw:()=>a.rw,s_:()=>r.s_,se:()=>r.se,vh:()=>a.vh,xz:()=>a.xz,zY:()=>r.zY});var r=i(35036),a=i(15383)},30561:(e,t,i)=>{"use strict";i.d(t,{K:()=>o,L:()=>s});var r=i(16261),a=i(87358);let n=(e="")=>e.endsWith("/graphql")?e:`${e.replace(/\/$/,"")}/graphql`,o=()=>(0,r.Iu)()===r.Pg.SINGLE||!0,s=e=>{let t=e===r.Pg.SINGLE,i=t?a.env.NEXT_PUBLIC_SINGLE_VENDOR_SERVER_URL:a.env.NEXT_PUBLIC_SERVER_URL,o=t?a.env.NEXT_PUBLIC_SINGLE_VENDOR_WS_SERVER_URL:a.env.NEXT_PUBLIC_WS_SERVER_URL,s=t&&a.env.NEXT_PUBLIC_SINGLE_VENDOR_REST_URL||i;return{mode:e,graphqlUrl:n(i),websocketUrl:n(o),restUrl:((e="")=>e?`${e.replace(/\/$/,"")}/`:"")(s),publicAccessRequired:!0}}},35036:(e,t,i)=>{"use strict";i.d(t,{cK:()=>S,Y8:()=>n,Ze:()=>v,Zt:()=>h,fJ:()=>s,C3:()=>o,ox:()=>l,s_:()=>m,S3:()=>d,Kk:()=>u,Dw:()=>A,Ou:()=>g,Zh:()=>f,Cf:()=>a,CY:()=>c,eq:()=>p,se:()=>y,zY:()=>$,Ec:()=>b,E4:()=>_,hO:()=>w});var r=i(16763);let a=(0,r.J1)`
  mutation SelectAddress($id: String!) {
    selectAddress(id: $id) {
      _id
      addresses {
        _id
        label
        deliveryAddress
        details
        location {
          coordinates
        }
        selected
      }
    }
  }
`,n=(0,r.J1)`
  mutation CreateAddress($addressInput: AddressInput!) {
    createAddress(addressInput: $addressInput) {
      _id
      addresses {
        _id
        label
        deliveryAddress
        details
        location {
          coordinates
        }
        selected
      }
    }
  }
`,o=(0,r.J1)`
  mutation EditAddress($addressInput: AddressInput!) {
    editAddress(addressInput: $addressInput) {
      _id
      addresses {
        _id
        label
        deliveryAddress
        details
        location {
          coordinates
        }
        selected
      }
    }
  }
`,s=(0,r.J1)`
  mutation DeleteAddress($id: ID!) {
    deleteAddress(id: $id) {
      _id
      addresses {
        _id
        label
        deliveryAddress
        details
        location {
          coordinates
        }
      }
    }
  }
`,d=(0,r.J1)`
  mutation Login(
    $type: String!
    $email: String
    $password: String
    $appleId: String
    $idToken: String
    $name: String
    $notificationToken: String
    $isActive: Boolean
    ) {
      login(
      type: $type
      email: $email
      password: $password
      appleId: $appleId
      idToken: $idToken
      name: $name
      notificationToken: $notificationToken
      isActive: $isActive
      ) {
        userId
        token
        tokenExpiration
        name
      phone
      phoneIsVerified
      email
      emailIsVerified
      picture
      addresses {
        location {
          coordinates
        }
        deliveryAddress
      }
      isNewUser
      userTypeId
      isActive
    }
  }
`,l=(0,r.J1)`
  mutation EmailExist($email: String!) {
    emailExist(email: $email)
  }
`,u=(0,r.J1)`
  mutation PhoneExist($phone: String!) {
    phoneExist(phone: $phone)
  }
`,c=(0,r.J1)`
  mutation SendOtpToEmail($email: String!) {
    sendOtpToEmail(email: $email) {
      result
    }
  }
`,p=(0,r.J1)`
  mutation SendOtpToPhoneNumber($phone: String!) {
    sendOtpToPhoneNumber(phone: $phone) {
      result
    }
  }
`,m=(0,r.J1)`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      result
    }
  }
`,g=(0,r.J1)`
  mutation ResetPassword($password: String!, $email: String!) {
    resetPassword(password: $password, email: $email) {
      result
    }
  }
`,f=(0,r.J1)`
  mutation ResetPassword($password: String!, $email: String!, $token: String!) {
    resetPassword(password: $password, email: $email, token: $token) {
      result
    }
  }
`,v=(0,r.J1)`
  mutation CreateUser(
    $phone: String
    $email: String
    $password: String
    $name: String
    $notificationToken: String
    $appleId: String
    $emailIsVerified: Boolean
    $isPhoneExists: Boolean
    ) {
      createUser(
      userInput: {
        phone: $phone
        email: $email
        password: $password
        name: $name
        notificationToken: $notificationToken
        appleId: $appleId
        emailIsVerified: $emailIsVerified
        isPhoneExists: $isPhoneExists
      }
      ) {
      userId
      token
      tokenExpiration
      name
      phone
      phoneIsVerified
      email
      emailIsVerified
      picture
      isNewUser
      userTypeId
      emailIsVerified
    }
  }
`,y=(0,r.J1)`
  mutation UpdateUser(
    $name: String!
    $phone: String
    $phoneIsVerified: Boolean
    $emailIsVerified: Boolean
  ) {
    updateUser(
      updateUserInput: {
        name: $name
        phone: $phone
        phoneIsVerified: $phoneIsVerified
        emailIsVerified: $emailIsVerified
      }
    ) {
      _id
      name
      phone
      phoneIsVerified
      emailIsVerified
    }
  }
`,h=(0,r.J1)`
  mutation DeactivateUser($isActive: Boolean!, $email: String!) {
    Deactivate(isActive: $isActive, email: $email) {
      _id
      name
      email
      isActive
    }
  }
`,b=(0,r.J1)`
  mutation VerifyOtp($otp: String!, $email: String, $phone: String) {
    verifyOtp(otp: $otp, email: $email, phone: $phone) {
      result
    }
  }
`,$=(0,r.J1)`
  mutation Coupon($coupon: String! $restaurantId: ID!) {
    coupon(coupon: $coupon restaurantId: $restaurantId) {
      success
      message
      coupon{
      _id
      title
      discount
      enabled
      }
   
    }
  }
`,_=(0,r.J1)`mutation SaveNotificationTokenWeb($token:String!){
    saveNotificationTokenWeb(token:$token){
      success
      message
    }
  }`,w=(0,r.J1)` mutation updateNotificationStatus($orderNotification: Boolean!, $offerNotification: Boolean! ) {
   updateNotificationStatus(offerNotification:$offerNotification,orderNotification:$orderNotification){
    name,
    phone,
   }
  }
`,A=(0,r.J1)`
  mutation PlaceOrder(
    $restaurant: String!
    $orderInput: [OrderInput!]!
    $paymentMethod: String!
    $couponCode: String
    $tipping: Float!
    $taxationAmount: Float!
    $address: AddressInput!
    $orderDate: String!
    $isPickedUp: Boolean!
    $deliveryCharges: Float!
    $instructions: String
  ) {
    placeOrder(
      restaurant: $restaurant
      orderInput: $orderInput
      paymentMethod: $paymentMethod
      couponCode: $couponCode
      tipping: $tipping
      taxationAmount: $taxationAmount
      address: $address
      orderDate: $orderDate
      isPickedUp: $isPickedUp
      deliveryCharges: $deliveryCharges
      instructions: $instructions
    ) {
      _id
      orderId
      restaurant {
        _id
        name
        image
        slug
        address
        location {
          coordinates
        }
      }
      deliveryAddress {
        location {
          coordinates
        }
        deliveryAddress
      }
      items {
        _id
        title
        food
        description
        quantity
        variation {
          _id
          title
          price
          discounted
        }
        addons {
          _id
          options {
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
      user {
        _id
        name
        phone
      }
      rider {
        _id
        name
      }
      review {
        _id
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      orderDate
      expectedTime
      isPickedUp
      deliveryCharges
      tipping
      taxationAmount
      createdAt
      completionTime
      preparationTime
      eta {
        phase source readyAt baseArrivalAt estimatedArrivalAt
        windowStartAt windowEndAt durationSeconds distanceMeters
        encodedPolyline calculatedAt lastLocationAt version
      }
    }
  }
`,S=(0,r.J1)`
  mutation ReviewOrder(
    $order: String!
    $rating: Int!
    $description: String
    $comments: String
  ) {
    reviewOrder(
      reviewInput: {
        order: $order
        rating: $rating
        description: $description
        comments: $comments
      }
    ) {
      _id
      orderId
      restaurant {
        _id
        name
        image
        address
        location {
          coordinates
        }
      }
      deliveryAddress {
        location {
          coordinates
        }
        deliveryAddress
        id
      }
      items {
        _id
        title
        food
        description
        quantity
        variation {
          _id
          title
          price
          discounted
        }
        addons {
          _id
          options {
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
      user {
        _id
        name
        phone
      }
      rider {
        _id
        name
      }
      review {
        _id
        rating
        description
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      tipping
      taxationAmount
      createdAt
      completionTime
      preparationTime
      orderDate
      expectedTime
      isPickedUp
      deliveryCharges
      acceptedAt
      pickedAt
      deliveredAt
      cancelledAt
      assignedAt
      eta {
        phase source readyAt baseArrivalAt estimatedArrivalAt
        windowStartAt windowEndAt durationSeconds distanceMeters
        encodedPolyline calculatedAt lastLocationAt version
      }
    }
  }
`;(0,r.J1)`
  mutation AbortOrder($id: String!) {
    abortOrder(id: $id) {
      _id
      orderId
      orderStatus
      cancelledAt
      reason
      eta {
        phase source readyAt baseArrivalAt estimatedArrivalAt
        windowStartAt windowEndAt durationSeconds distanceMeters
        encodedPolyline calculatedAt lastLocationAt version
      }
      restaurant {
        _id
        name
      }
      user {
        _id
        name
      }
      rider {
        _id
        name
      }
    }
  }
`},36918:(e,t,i)=>{"use strict";i.d(t,{IL:()=>n,$i:()=>d,xs:()=>a,cS:()=>o,q4:()=>s,Bq:()=>m,E6:()=>p,SX:()=>c});var r=i(92584);let a={error:{bgColor:"#FFC5C5",textColor:"#FF0000",icon:r.rfe,iconBg:"#FFC5C5"},success:{bgColor:"#C6F7D0",textColor:"#34C759",icon:r.e68,iconBg:"#C6F7D0"},info:{bgColor:"#B2E2FC",textColor:"#2196F3",icon:r.iW_,iconBg:"#B2E2FC"},warn:{bgColor:"#F7DC6F",textColor:"#F7DC6F",icon:r.zpE,iconBg:"#F7DC6F"}},n=[{label:"cash",value:"COD",icon:r.CP4},{label:"card",value:"STRIPE",icon:r.$O8}],o="user-current-location",s=[{value:"English",code:"en",index:0},{value:"العربية",code:"ar",index:1},{value:"fran\xe7ais",code:"fr",index:2},{value:"ភាសាខ្មែរ",code:"km",index:3},{value:"中文",code:"zh",index:4},{value:"Deutsche",code:"de",index:5},{value:"עִברִית",code:"he",index:6},{value:"हिंदी",code:"hi",index:7},{value:"espa\xf1ol",code:"es",index:8},{value:"বাংলা",code:"bn",index:9},{value:"portugu\xeas",code:"pt",index:10},{value:"русский",code:"ru",index:11},{value:"اردو",code:"ur",index:12},{value:"Bahasa Indonesia",code:"id",index:13},{value:"日本語",code:"jp",index:14},{value:"T\xfcrk\xe7e",code:"tr",index:15},{value:"मराठी",code:"mr",index:16},{value:"తెలుగు",code:"te",index:17},{value:"Tiếng Việt",code:"vi",index:18},{value:"한국어",code:"ko",index:19},{value:"italiano",code:"it",index:20},{value:"ไทย",code:"th",index:21},{value:"ગુજરાતી",code:"gu",index:22},{value:"فارسی",code:"fa",index:23},{value:"polski",code:"pl",index:24},{value:"پښتو",code:"ps",index:25},{value:"rom\xe2nă",code:"ro",index:26},{value:"کوردی",code:"ku",index:27},{value:"ozbek",code:"uz",index:28},{value:"azərbaycan",code:"az",index:29},{value:"Nederlands",code:"nl",index:30},{value:"Қазақша",code:"kk",index:31}],d=["At_least_6_characters_label","At_least_one_lowercase_letter_(a-z)_label","At_least_one_uppercase_letter_(A-Z)_label","At_least_one_number_(0-9)_label","At_least_one_special_character","Password_does_not_match"];[...d];var l=i(50910),u=i(56788);let c=()=>{let e=(0,l.c)(),{isSingleVendor:t}=(0,u.q)(),i=[{label:e("profileDefaultTabs.tab1"),path:"/profile"},{label:e("profileDefaultTabs.tab2"),path:"/profile/addresses"},{label:e("profileDefaultTabs.tab3"),path:"/profile/order-history"},{label:e("profileDefaultTabs.tab4"),path:"/profile/settings"},{label:e("profileDefaultTabs.tab5"),path:"/profile/getHelp"},{label:e("profileDefaultTabs.tab6"),path:"/profile/customerTicket"}];return t?[...i.slice(0,3),{label:"Favorites",path:"/profile/favorites"},{label:"Vouchers",path:"/profile/vouchers"},{label:"Wallet",path:"/profile/wallet"},{label:"Membership",path:"/profile/membership"},{label:"Referral",path:"/profile/referral"},...i.slice(3)]:i},p=[{value:1,emoji:"\uD83D\uDE16",label:"Horrible"},{value:2,emoji:"\uD83D\uDE41",label:"Bad"},{value:3,emoji:"\uD83D\uDE10",label:"Meh"},{value:4,emoji:"\uD83D\uDE42",label:"Good"},{value:5,emoji:"\uD83D\uDE04",label:"Awesome"}],m=["Courier_Professionalism","Estimate","Delivery_on_time"]},43054:(e,t,i)=>{"use strict";i.d(t,{Q:()=>n});var r=i(43062);function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,r=Array(t);i<t;i++)r[i]=e[i];return r}var n={DEFAULT_MASKS:{pint:/[\d]/,int:/[\d\-]/,pnum:/[\d\.]/,money:/[\d\.\s,]/,num:/[\d\-\.]/,hex:/[0-9a-f]/i,email:/[a-z0-9_\.\-@]/i,alpha:/[a-z_]/i,alphanum:/[a-z0-9_]/i},getRegex:function(e){return n.DEFAULT_MASKS[e]?n.DEFAULT_MASKS[e]:e},onBeforeInput:function(e,t,i){!i&&r.DV.isAndroid()&&this.validateKey(e,e.data,t)},onKeyPress:function(e,t,i){i||r.DV.isAndroid()||e.ctrlKey||e.altKey||e.metaKey||this.validateKey(e,e.key,t)},onPaste:function(e,t,i){if(!i){var r,n=this.getRegex(t);((function(e){if(Array.isArray(e))return a(e)})(r=e.clipboardData.getData("text"))||function(e){if("u">typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(r)||function(e){if(e){if("string"==typeof e)return a(e,void 0);var t=({}).toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?a(e,void 0):void 0}}(r)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()).forEach(function(t){if(!n.test(t))return e.preventDefault(),!1})}},validateKey:function(e,t,i){null==t||t.length<=2&&(this.getRegex(i).test(t)||e.preventDefault())},validate:function(e,t){var i=e.target.value,r=!0,a=this.getRegex(t);return i&&!a.test(i)&&(r=!1),r}}},46132:(e,t,i)=>{"use strict";i.d(t,{A:()=>n});var r=i(95155),a=i(7362);let n=({showLabel:e=!0})=>(0,r.jsxs)("div",{className:"w-full space-y-2",children:[e&&(0,r.jsx)(a.E,{width:"15%",height:"0.8rem",className:"h-10"}),(0,r.jsx)(a.E,{width:"100%",height:"2.97rem",className:"h-10"})]})},53859:(e,t,i)=>{Promise.resolve().then(i.bind(i,59971))},56788:(e,t,i)=>{"use strict";i.d(t,{LT:()=>a.L,Pg:()=>r.Pg,U6:()=>s.U6,mC:()=>o.mC,q:()=>s.q,qt:()=>s.qt,vi:()=>n.vi,xz:()=>r.xz});var r=i(16261),a=i(30561),n=i(89561),o=i(59386),s=i(74203)},59386:(e,t,i)=>{"use strict";i.d(t,{I1:()=>o,ZR:()=>d,mC:()=>s});var r=i(16261);let a=[/^\/restaurants/,/^\/store/,/^\/mapview/,/^\/restaurantInfo/],n=[/^\/deals/,/^\/browse/,/^\/product\//,/^\/profile\/(favorites|vouchers|wallet|membership|referral)/],o=(e,t)=>!(t===r.Pg.SINGLE?a:n).some(t=>t.test(e)),s=e=>e===r.Pg.SINGLE?"/discovery":"/",d=e=>s(e)},59971:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>c});var r=i(95155),a=i(18761),n=i(77977),o=i(9379),s=i(34080),d=i(50910),l=i(73321),u=i(12115);function c(){let e=(0,d.c)(),t=(0,l.useRouter)(),i=(0,l.useSearchParams)(),c=i.get("email")||"",p=i.get("token")||"",[m,g]=(0,u.useState)(""),[f,v]=(0,u.useState)(""),[y,h]=(0,u.useState)(""),[b,{loading:$}]=(0,s.n)(a.Zh);(0,u.useEffect)(()=>{c&&p||t.replace(`/auth/forgot-password?error=invalid&email=${encodeURIComponent(c)}`)},[c,p,t]);let _=async()=>{if(!m||m.length<6)return void h(e("please_enter_valid_password_message"));if(m!==f)return void h(e("Password_does_not_match"));try{h("");let e=await b({variables:{email:c,password:m,token:p}});if(e.data?.resetPassword?.result)return void t.replace("/auth/login");t.replace(`/auth/forgot-password?error=invalid&email=${encodeURIComponent(c)}`)}catch{t.replace(`/auth/forgot-password?error=invalid&email=${encodeURIComponent(c)}`)}};return(0,r.jsxs)("div",{className:"mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-16",children:[(0,r.jsx)("h1",{className:"text-3xl font-semibold",children:e("update_password_title")}),(0,r.jsx)("p",{className:"mt-3 text-sm text-neutral-600",children:c||e("reset_link_invalid_or_expired_message")}),(0,r.jsxs)("div",{className:"mt-6 flex flex-col gap-4",children:[(0,r.jsx)(o.A,{value:m,showLabel:!1,name:"password",placeholder:e("password_label"),onChange:e=>g(e.target.value)}),(0,r.jsx)(o.A,{value:f,showLabel:!1,name:"confirmPassword",placeholder:e("Confirm Password"),onChange:e=>v(e.target.value)})]}),y?(0,r.jsx)("p",{className:"mt-4 text-sm text-red-500",children:y}):null,(0,r.jsx)(n.A,{label:e("continue_label"),loading:$,onClick:_,className:"mt-6 rounded-full bg-primary-color p-3"})]})}},60562:(e,t,i)=>{"use strict";i.d(t,{S:()=>f});var r=i(12115),a=i(59218),n=i(47834),o=i(4634),s=i(43054),d=i(10290),l=i(43062);function u(){return(u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var r in i)({}).hasOwnProperty.call(i,r)&&(e[r]=i[r])}return e}).apply(null,arguments)}function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var p=n.x.extend({defaultProps:{__TYPE:"InputText",__parentMetadata:null,children:void 0,className:null,invalid:!1,variant:null,keyfilter:null,onBeforeInput:null,onInput:null,onKeyDown:null,onPaste:null,tooltip:null,tooltipOptions:null,validateOnly:!1,iconPosition:null},css:{classes:{root:function(e){var t=e.props,i=e.isFilled,r=e.context;return(0,l.xW)("p-inputtext p-component",{"p-disabled":t.disabled,"p-filled":i,"p-invalid":t.invalid,"p-variant-filled":t.variant?"filled"===t.variant:r&&"filled"===r.inputStyle})}}}});function m(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,r)}return i}function g(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?m(Object(i),!0).forEach(function(t){!function(e,t,i){var r;(r=function(e,t){if("object"!=c(e)||!e)return e;var i=e[Symbol.toPrimitive];if(void 0!==i){var r=i.call(e,t||"default");if("object"!=c(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==c(r)?r:r+"")in e)?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i}(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):m(Object(i)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}var f=r.memo(r.forwardRef(function(e,t){var i=(0,o.qV)(),c=r.useContext(a.UM),m=p.getProps(e,c),f=p.setMetaData(g(g({props:m},m.__parentMetadata),{},{context:{disabled:m.disabled,iconPosition:m.iconPosition}})),v=f.ptm,y=f.cx,h=f.isUnstyled;(0,n.j)(p.css.styles,h,{name:"inputtext",styled:!0});var b=r.useRef(t);r.useEffect(function(){l.BF.combinedRefs(b,t)},[b,t]);var $=r.useMemo(function(){return l.BF.isNotEmpty(m.value)||l.BF.isNotEmpty(m.defaultValue)},[m.value,m.defaultValue]),_=l.BF.isNotEmpty(m.tooltip);r.useEffect(function(){var e;$||null!=(e=b.current)&&e.value?l.DV.addClass(b.current,"p-filled"):l.DV.removeClass(b.current,"p-filled")},[m.disabled,$]);var w=i({className:(0,l.xW)(m.className,y("root",{context:c,isFilled:$})),autoComplete:m.autoComplete,onBeforeInput:function(e){m.onBeforeInput&&m.onBeforeInput(e),m.keyfilter&&s.Q.onBeforeInput(e,m.keyfilter,m.validateOnly)},onInput:function(e){var t=e.target,i=!0;m.keyfilter&&m.validateOnly&&(i=s.Q.validate(e,m.keyfilter)),m.onInput&&m.onInput(e,i),l.BF.isNotEmpty(t.value)?l.DV.addClass(t,"p-filled"):l.DV.removeClass(t,"p-filled")},onKeyDown:function(e){m.onKeyDown&&m.onKeyDown(e),m.keyfilter&&s.Q.onKeyPress(e,m.keyfilter,m.validateOnly)},onPaste:function(e){m.onPaste&&m.onPaste(e),m.keyfilter&&s.Q.onPaste(e,m.keyfilter,m.validateOnly)}},p.getOtherProps(m),v("root"));return r.createElement(r.Fragment,null,r.createElement("input",u({ref:b},w)),_&&r.createElement(d.m,u({target:b,content:m.tooltip,pt:v("tooltip")},m.tooltipOptions)))}));f.displayName="InputText"},74203:(e,t,i)=>{"use strict";i.d(t,{U6:()=>c,q:()=>p,qt:()=>m});var r=i(95155),a=i(73321),n=i(12115),o=i(16261),s=i(30561),d=i(89561),l=i(59386);let u=(0,n.createContext)(null);function c({children:e}){let t=(0,a.useRouter)(),[i,p]=(0,n.useState)(o.ED),[m,g]=(0,n.useState)(!1),[f,v]=(0,n.useState)(!1),[y,h]=(0,n.useState)(0),b=(0,n.useRef)(new Set),$=(0,o.Iu)(),_=null===$,w=(0,s.K)();(0,n.useEffect)(()=>{(0,d.fT)();let e=window.localStorage.getItem(o.YB);if($){d.vi.set(o.YB,$),p($),g(!0);return}let t=(0,o.xz)(e)?e:o.ED;t!==o.Pg.SINGLE||w?p(t):(d.vi.set(o.YB,o.Pg.MULTI),p(o.Pg.MULTI)),g(!0)},[$,w]);let A=(0,n.useCallback)(async e=>{if(!(0,o.xz)(e)||!_||e===i||b.current.size>0||e===o.Pg.SINGLE&&!w)return!1;v(!0);try{return d.vi.set(o.YB,e),p(e),t.replace((0,l.ZR)(e)),!0}finally{v(!1)}},[_,i,t,w]),S=(0,n.useCallback)(()=>{let e=Symbol("mode-sensitive-operation");return b.current.add(e),h(b.current.size),()=>{b.current.delete(e),h(b.current.size)}},[]),I=(0,n.useMemo)(()=>({mode:i,isModeReady:m,isSwitchingMode:f,isModeSwitchBlocked:y>0,singleVendorAvailable:w,isModeToggleEnabled:_,isSingleVendor:i===o.Pg.SINGLE,switchMode:A,beginModeSensitiveOperation:S}),[i,m,f,y,w,_,A,S]);return(0,r.jsx)(u.Provider,{value:I,children:e})}let p=()=>{let e=(0,n.useContext)(u);if(!e)throw Error("useAppMode must be used inside AppModeProvider");return e},m=e=>{let{beginModeSensitiveOperation:t}=p();(0,n.useEffect)(()=>e?t():void 0,[e,t])}},77977:(e,t,i)=>{"use strict";i.d(t,{A:()=>o});var r=i(95155),a=i(23596),n=i(622);function o({className:e,label:t,type:i,loading:s,...d}){return(0,r.jsx)(a.$,{loading:s,disabled:s,className:(0,n.QP)("shadow-none text-sm",e),label:t,type:i,...d})}},88210:(e,t,i)=>{"use strict";i.d(t,{s:()=>r});var r=(0,i(43062).l7)()},89561:(e,t,i)=>{"use strict";i.d(t,{FD:()=>o,cX:()=>s,fT:()=>l,vi:()=>d});var r=i(16261);let a=new Set([r.YB,"theme","locale","NEXT_LOCALE","messaging-token","pendingOrderNavigation","knownOrderOrigins"]),n=["token","userType","userId","tokenExpiration","userToken","userAddress","location","restaurant","restaurant-slug","restaurantData","cartItems","cart-product-store-id","cart-product-store-slug","currentShopType","newOrderInstructions","orderInstructions","applied_coupon","coupon_text","is_coupon_applied","coupon_restaurant_id","pending_stripe_order_id","pending_stripe_started_at","searchedKeywords"],o=()=>{let e=window.localStorage.getItem(r.YB);return(0,r.xz)(e)?e:r.ED},s=(e,t=o())=>a.has(e)?e:`@enatega/${t.toLowerCase()}/${e}`,d={get:(e,t)=>window.localStorage.getItem(s(e,t)),set(e,t,i){window.localStorage.setItem(s(e,i),t)},remove(e,t){window.localStorage.removeItem(s(e,t))}},l=()=>{let e="@enatega/multi/storage-migrated-v1";if("true"!==window.localStorage.getItem(e)){for(let e of n){let t=window.localStorage.getItem(e),i=s(e,r.Pg.MULTI);null!==t&&null===window.localStorage.getItem(i)&&window.localStorage.setItem(i,t)}window.localStorage.setItem(e,"true")}}}},e=>{e.O(0,[2266,1697,5122,7013,3596,1530,622,9254,8441,3794,7358],()=>e(e.s=53859)),_N_E=e.O()}]);