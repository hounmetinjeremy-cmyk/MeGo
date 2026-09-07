"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2523],{4532:(e,t,i)=>{i.d(t,{ZO:()=>d,gf:()=>a,j6:()=>o});var r=i(16763);let a=(0,r.J1)`
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
`,o=(0,r.J1)`
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
`,d=(0,r.J1)`
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
`},15383:(e,t,i)=>{i.d(t,{pc:()=>s,Bt:()=>o,Nj:()=>y,uD:()=>a,OJ:()=>$,xz:()=>m,rw:()=>g,HC:()=>A,bg:()=>f,p6:()=>S,ZZ:()=>T,Qy:()=>p,SU:()=>d,gf:()=>v.gf,Qw:()=>c,P2:()=>n,vh:()=>I});var r=i(16763);let a=(0,r.J1)`
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
`,o=(0,r.J1)`
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
`;let d=(0,r.J1)`
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
`,n=(0,r.J1)`
  query RelatedItems($itemId: String!, $restaurantId: String!) {
    relatedItems(itemId: $itemId, restaurantId: $restaurantId)
  }
`,s=(0,r.J1)`
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
`,y=(0,r.J1)`
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
`,$=(0,r.J1)`
  query PopularItems($restaurantId: String!) {
    popularItems(restaurantId: $restaurantId) {
      id
      count
    }
  }
`,A=(0,r.J1)`
  query subCategories {
    subCategories {
      _id
      title
      parentCategoryId
    }
  }
`,I=(0,r.J1)`
  ${u}
  query TopRatedVendors($latitude: Float!, $longitude: Float!) {
    topRatedVendorsPreview(latitude: $latitude, longitude: $longitude) {
      ...RestaurantCarouselPreviewFields
    }
  }
`;var v=i(4532);let S=(0,r.J1)`
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
        }`,f=(0,r.J1)`
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
`,T=(0,r.J1)`
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
`},16261:(e,t,i)=>{i.d(t,{ED:()=>o,Iu:()=>n,Pg:()=>a,YB:()=>d,xz:()=>s});var r=i(87358);let a={MULTI:"MULTI",SINGLE:"SINGLE"},o=a.MULTI,d="@enatega/app-mode",n=()=>{let e=r.env.NEXT_PUBLIC_VENDOR_MODE?.toUpperCase();return e===a.SINGLE?a.SINGLE:e===a.MULTI?a.MULTI:null},s=e=>e===a.MULTI||e===a.SINGLE},16771:(e,t,i)=>{i.d(t,{$_:()=>m,BG:()=>c,HD:()=>k,Hp:()=>o,Jg:()=>u,Nn:()=>f,Os:()=>A,S3:()=>n,UR:()=>l,Uy:()=>T,Wf:()=>D,a$:()=>w,dV:()=>p,f1:()=>y,ju:()=>I,lb:()=>g,mZ:()=>O,pU:()=>v,q2:()=>$,qA:()=>C,qN:()=>S,qx:()=>_,xm:()=>h,y4:()=>s,yZ:()=>d,yu:()=>P,zz:()=>a});var r=i(16763);let a=(0,r.J1)`
  query SingleVendorDiscovery($previewLimit: Int, $dealLimit: Int) {
    singleVendorDiscovery(previewLimit: $previewLimit, dealLimit: $dealLimit) {
      catalogVersion
      banners {
        _id
        title
        description
        action
        screen
        file
        parameters
        buttonText
      }
      categories {
        id
        name
        icon
        image
        description
        itemCount
        viewType
        pagination {
          totalItems
          hasMore
        }
        items {
          id
          title
          description
          image
          isOutOfStock
          variations {
            id
            title
            price
            isOutOfStock
            deal {
              id
              discountType
              discountValue
              isActive
            }
          }
        }
      }
      deals {
        limitedTime {
          items {
            id
            title
            description
            image
            isOutOfStock
            variations {
              id
              title
              price
              isOutOfStock
              deal {
                id
                discountType
                discountValue
                isActive
              }
            }
          }
          totalCount
          hasMore
        }
        weekly {
          items {
            id
            title
            description
            image
            isOutOfStock
            variations {
              id
              title
              price
              isOutOfStock
              deal {
                id
                discountType
                discountValue
                isActive
              }
            }
          }
          totalCount
          hasMore
        }
        newOffers {
          items {
            id
            title
            description
            image
            isOutOfStock
            variations {
              id
              title
              price
              isOutOfStock
              deal {
                id
                discountType
                discountValue
                isActive
              }
            }
          }
          totalCount
          hasMore
        }
      }
    }
  }
`,o=(0,r.J1)`
  query SingleVendorConfiguration {
    configuration: publicConfiguration {
      _id
      currency
      currencySymbol
      deliveryRate
      twilioEnabled
      publishableKey
      appAmplitudeApiKey
      customerAppSentryUrl
      termsAndConditions
      privacyPolicy
      skipMobileVerification
      skipEmailVerification
      costType
    }
  }
`,d=(0,r.J1)`
  query SingleVendorProfile {
    profile {
      _id
      name
      phone
      phoneIsVerified
      email
      emailIsVerified
      notificationToken
      userType
      isActive
      isOrderNotification
      isOfferNotification
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
      favourite
      stripe_plan_id
    }
  }
`,n=(0,r.J1)`
  mutation LoginSingleVendor(
    $email: String
    $password: String
    $type: String!
    $appleId: String
    $idToken: String
    $name: String
    $notificationToken: String
  ) {
    login(
      email: $email
      password: $password
      type: $type
      appleId: $appleId
      idToken: $idToken
      name: $name
      notificationToken: $notificationToken
    ) {
      userId
      token
      tokenExpiration
      isActive
      name
      email
      phone
      isNewUser
    }
  }
`,s=(0,r.J1)`
  mutation EmailExistSingleVendor($email: String!) {
    emailExist(email: $email) {
      _id
    }
  }
`,l=(0,r.J1)`
  mutation PhoneExistSingleVendor($phone: String!) {
    phoneExist(phone: $phone) {
      _id
    }
  }
`,u=(0,r.J1)`
  query GetRestaurantCategoriesSingleVendor {
    getRestaurantCategoriesSingleVendor {
      id
      name
      icon
      image
      description
      itemCount
      viewType
    }
  }
`;(0,r.J1)`
  query SingleVendorBanners {
    banners {
      _id
      title
      description
      action
      screen
      file
      parameters
      buttonText
      slug
      shopType
    }
  }
`,(0,r.J1)`
  query GetAllCategoriesWithSubCategoriesDataSeeAllSingleVendor {
    getAllCategoriesWithSubCategoriesDataSeeAllSingleVendor {
      categoryId
      categoryName
      items {
        id
        title
        image
        description
        isOutOfStock
        variations {
          id
          title
          price
          isOutOfStock
          deal {
            id
            discountType
            discountValue
            isActive
          }
        }
        subCategory
      }
      subCategories {
        subCategoryId
        subCategoryName
        items {
          id
          title
          image
          description
          isOutOfStock
          variations {
            id
            title
            price
            isOutOfStock
            deal {
              id
              discountType
              discountValue
              isActive
            }
          }
          subCategory
        }
      }
    }
  }
`,(0,r.J1)`
  query GetCategoryItemsSingleVendor(
    $categoryId: ID!
    $skip: Int
    $limit: Int
    $search: String
  ) {
    getCategoryItemsSingleVendor(
      categoryId: $categoryId
      skip: $skip
      limit: $limit
      search: $search
    ) {
      categoryId
      categoryName
      items {
        id
        title
        description
        image
        isOutOfStock
        variations {
          id
          title
          price
          isOutOfStock
          deal {
            id
            discountType
            discountValue
            isActive
          }
        }
      }
      pagination {
        currentPage
        totalPages
        totalItems
        hasMore
      }
    }
  }
`,(0,r.J1)`
  query GetFoodDetails($foodId: ID!, $categoryId: ID) {
    getFoodDetails(foodId: $foodId, categoryId: $categoryId) {
      id
      title
      description
      image
      isPopular
      isOutOfStock
      cartQuantity
      usage
      ingredients
      nutritionDetail
      categoryId
      nutritions {
        name
        quantity
      }
      variations {
        id
        title
        price
        isOutOfStock
        cartQuantity
        isSelected
        actualUnitPrice
        discountedUnitPrice
        deal {
          id
          discountType
          discountValue
          isActive
        }
        addons {
          id
          title
          description
          isSelected
          quantityMinimum
          quantityMaximum
          options {
            id
            title
            description
            price
            isSelected
          }
        }
      }
    }
  }
`,(0,r.J1)`
  query GetSimilarFoods($foodId: ID!, $skip: Int, $limit: Int) {
    getSimilarFoods(foodId: $foodId, skip: $skip, limit: $limit) {
      items {
        id
        title
        description
        image
        categoryId
        isOutOfStock
        variations {
          id
          title
          price
          isOutOfStock
          deal {
            id
            discountType
            discountValue
            isActive
          }
        }
      }
      pagination {
        totalItems
        hasMore
      }
    }
  }
`,(0,r.J1)`
  query GetLimitedTimeFoodsDeals {
    getLimitedTimeFoodsDeals {
      items {
        id
        title
        description
        image
        categoryId
        variations {
          id
          title
          price
          outofstock
          deal {
            id
            title
            discountType
            discountValue
            isActive
          }
        }
      }
    }
  }
`,(0,r.J1)`
  query GetWeeklyFoodsDeals {
    getWeeklyFoodsDeals {
      items {
        id
        title
        description
        image
        categoryId
        variations {
          id
          title
          price
          outofstock
          deal {
            id
            title
            discountType
            discountValue
            isActive
          }
        }
      }
    }
  }
`;let c=(0,r.J1)`
  query SearchSingleVendorFoods($search: String!, $skip: Int, $limit: Int) {
    searchSingleVendorFoods(search: $search, skip: $skip, limit: $limit) {
      items {
        id
        title
        description
        subCategory
        categoryId
        image
        isOutOfStock
        variations {
          id
          title
          price
          isOutOfStock
          deal {
            id
            discountType
            discountValue
            isActive
          }
        }
      }
      totalCount
      hasMore
    }
  }
`,p=(0,r.J1)`
  query GetUserCart {
    getUserCart {
      success
      message
      actualGrandTotal
      discountedGrandTotal
      totalDiscount
      hasDeals
      isBelowMinimumOrder
      lowOrderFees
      maxOrderAmount
      minOrderAmount
      cartId
      foods {
        categoryId
        foodId
        foodTitle
        foodImage
        variations {
          _id
          variationId
          variationTitle
          unitPrice
          quantity
          addons {
            addonId
            optionId
            title
            price
          }
          addonsTotal
          actualUnitPrice
          discountedUnitPrice
          actualItemTotal
          discountedItemTotal
          itemTotal
          dealId
          dealInfo {
            dealId
            dealTitle
            discountValue
            discountType
          }
        }
        actualFoodTotal
        discountedFoodTotal
        foodTotal
      }
    }
  }
`,m=(0,r.J1)`
  mutation UserCartData($input: CartInput!) {
    userCartData(input: $input) {
      success
      message
      actualGrandTotal
      discountedGrandTotal
      totalDiscount
      hasDeals
      isBelowMinimumOrder
      lowOrderFees
      maxOrderAmount
      minOrderAmount
      cartId
      foods {
        categoryId
        foodId
        foodTitle
        foodImage
        variations {
          _id
          variationId
          variationTitle
          unitPrice
          quantity
          addons {
            addonId
            optionId
            title
            price
          }
          addonsTotal
          actualUnitPrice
          discountedUnitPrice
          actualItemTotal
          discountedItemTotal
          itemTotal
          dealId
          dealInfo {
            dealId
            dealTitle
            discountValue
            discountType
          }
        }
        actualFoodTotal
        discountedFoodTotal
        foodTotal
      }
    }
  }
`,g=(0,r.J1)`
  mutation UpdateUserCartCount($input: UpdateCartCountInput!) {
    updateUserCartCount(input: $input) {
      success
      message
      quantity
      itemTotal
      foodTotal
      grandTotal
      isBelowMinimumOrder
    }
  }
`,y=(0,r.J1)`
  mutation ClearCart {
    clearCart {
      success
      message
    }
  }
`,$=(0,r.J1)`
  query CalculateCheckout(
    $isPickup: Boolean
    $latDestination: Float
    $longDestination: Float
    $coupon: String
  ) {
    calculateCheckout(
      isPickup: $isPickup
      latDestination: $latDestination
      longDestination: $longDestination
      coupon: $coupon
    ) {
      success
      message
      cartId
      subtotal
      deliveryCharges
      originalDeliveryCharges
      deliveryDiscount
      serviceFee
      minimumOrderFee
      taxAmount
      taxPercentage
      grandTotal
      totalDiscount
      discountDetails {
        dealDiscount
      }
      hasActiveSubscription
      freeDeliveriesRemaining
      minimumOrderAmount
      isBelowMinimumOrder
      isBelowMaximumOrder
      couponDiscountAmount
      couponApplied
      priorityDeliveryFees
      creditsUsed
      maximumOrderAmount
      checkoutQuoteId
      checkoutQuoteExpiresAt
      cartRevision
      items {
        foodId
        foodTitle
        categoryId
        variationId
        variationTitle
        quantity
        unitPrice
        addons {
          id
          title
          price
          addonId
        }
        addonsTotal
        itemTotal
      }
    }
  }
`,A=(0,r.J1)`
  query GetScheduleByDay {
    getScheduleByDay {
      date
      day
      dayId
      timings {
        id
        times {
          id
          startTime
          endTime
          maxOrder
        }
      }
    }
  }
`,I=(0,r.J1)`
  mutation SingleVendorPlaceOrder(
    $paymentMethod: String!
    $address: AddressInput!
    $tipping: Float!
    $orderDate: String!
    $isPickedUp: Boolean!
    $specialInstructions: String
    $couponCode: String
    $instructions: String
    $scheduleData: ScheduleData
    $isPriority: Boolean
    $idempotencyKey: String
    $checkoutQuoteId: String
  ) {
    placeOrder(
      paymentMethod: $paymentMethod
      address: $address
      tipping: $tipping
      orderDate: $orderDate
      isPickedUp: $isPickedUp
      specialInstructions: $specialInstructions
      couponCode: $couponCode
      instructions: $instructions
      scheduleData: $scheduleData
      isPriority: $isPriority
      idempotencyKey: $idempotencyKey
      checkoutQuoteId: $checkoutQuoteId
    ) {
      _id
      orderId
      paymentMethod
      paidAmount
      orderAmount
      paymentStatus
      orderStatus
      deliveryCharges
      tipping
      taxationAmount
      createdAt
      orderDate
      expectedTime
      isPickedUp
    }
  }
`,v=(0,r.J1)`
  query SingleVendorActiveOrders($limit: Int, $page: Int) {
    getUsersActiveOrders(limit: $limit, page: $page) {
      _id
      orderId
      restaurant {
        name
        image
      }
      orderAmount
      orderStatus
      createdAt
      orderDate
      expectedTime
    }
  }
`,S=(0,r.J1)`
  query SingleVendorRecentActiveOrder {
    recentActiveOrder {
      success
      message
      rawOrder {
        _id
        orderId
        orderStatus
        orderState
        orderAmount
        createdAt
        expectedTime
        completionTime
        isPickedUp
        restaurant {
          _id
          name
          image
          address
        }
        deliveryAddress {
          deliveryAddress
        }
        items {
          _id
          title
          quantity
        }
        eta {
          phase
          estimatedArrivalAt
          windowStartAt
          windowEndAt
        }
      }
    }
  }
`,f=(0,r.J1)`
  query SingleVendorPastOrders($limit: Int, $page: Int) {
    getUsersPastOrders(limit: $limit, page: $page) {
      _id
      orderId
      restaurant {
        name
        image
      }
      orderAmount
      orderStatus
      createdAt
      completionTime
      orderDate
      deliveredAt
    }
  }
`,T=(0,r.J1)`
  query GetFavoriteFoodsSingleVendor($limit: Int, $skip: Int) {
    getFavoriteFoodsSingleVendor(limit: $limit, skip: $skip) {
      success
      message
      data {
        _id
        title
        image
        categoryId
        isFavourite
        isOutOfStock
        variations {
          _id
          title
          price
          discounted
          isOutOfStock
          deal {
            id
            discountType
            discountValue
            isActive
          }
        }
      }
    }
  }
`;(0,r.J1)`
  mutation ToggleFavoriteFoodSingleVendor($id: ID!) {
    toggleFavoriteFoodSingleVendor(id: $id) {
      success
      message
      isFavorite
    }
  }
`;let _=(0,r.J1)`
  query SingleVendorVouchers {
    couponsbyRestaurant {
      _id
      title
      discount
      enabled
      couponType
    }
  }
`,h=(0,r.J1)`
  query GetAllUserCredits {
    getAllUserCredits {
      credits
    }
  }
`,w=(0,r.J1)`
  query GetAllSubscriptionPlans {
    getAllSubscriptionPlans {
      plans {
        id
        amount
        interval
        intervalCount
        productName
        productId
        discountPercent
      }
    }
  }
`,O=(0,r.J1)`
  mutation CreateSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      message
    }
  }
`,k=(0,r.J1)`
  mutation UpdateSubscription($input: UpdateSubscriptionInput!) {
    updateSubscription(input: $input) {
      message
    }
  }
`,C=(0,r.J1)`
  mutation CancelSubscription {
    cancelSubscription {
      message
    }
  }
`,P=(0,r.J1)`
  query GetMyReferralCode {
    getMyReferralCode
  }
`,D=(0,r.J1)`
  subscription SingleVendorOrderStatusChanged($userId: String!) {
    orderStatusChanged(userId: $userId) {
      userId
      origin
      rawOrder {
        _id
        orderId
        orderStatus
        orderState
        paymentMethod
        paidAmount
        orderAmount
        isPickedUp
        deliveryCharges
        createdAt
        expectedTime
        rider {
          _id
          name
          phone
          location {
            coordinates
          }
        }
        eta {
          phase
          source
          readyAt
          baseArrivalAt
          estimatedArrivalAt
          windowStartAt
          windowEndAt
          durationSeconds
          distanceMeters
          encodedPolyline
          origin {
            latitude
            longitude
          }
          destination {
            latitude
            longitude
          }
          calculatedAt
          lastLocationAt
          version
        }
      }
    }
  }
`;(0,r.J1)`
  subscription SingleVendorPaymentSuccess($userId: String!) {
    subscriptionPaymentSuccess(userId: $userId) {
      userId
      orderId
      orderObjId
      orderStatus
      paymentStatus
      paymentMethod
    }
  }
`,(0,r.J1)`
  query SingleVendorOrderDetailsPage($orderId: String!) {
    orderDetailsPage(orderId: $orderId) {
      success
      message
      rawOrder {
        _id
        orderId
        orderStatus
        orderState
        paymentMethod
        paidAmount
        orderAmount
        tipping
        taxationAmount
        createdAt
        completionTime
        preparationTime
        orderDate
        expectedTime
        isPickedUp
        deliveryType
        deliveryCharges
        acceptedAt
        pickedAt
        deliveredAt
        cancelledAt
        scheduledAt
        assignedAt
        instructions
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
        rider {
          _id
          name
          phone
          location {
            coordinates
          }
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
        }
        eta {
          phase
          source
          readyAt
          baseArrivalAt
          estimatedArrivalAt
          windowStartAt
          windowEndAt
          durationSeconds
          distanceMeters
          encodedPolyline
          origin {
            latitude
            longitude
          }
          destination {
            latitude
            longitude
          }
          calculatedAt
          lastLocationAt
          version
        }
      }
      data {
        _id
        orderId
        paidAmount
        orderAmount
        orderStatus
        paymentStatus
        deliveryCharges
        deliveryDiscount
        couponDiscount
        tipping
        taxationAmount
        orderDate
        isPriority
        isPickedUp
        completionTime
        instructions
        itemsSubTotal
        minimumOrderFee
        minimumOrderAmount
        isBelowMinimumOrder
        isBelowMaximumOrder
        freeDeliveriesRemaining
        priorityDeliveryFees
        deliverChargesAmount
        couponDiscountApplied
        creditsApplied
        rider {
          phone
        }
        deliveryAddress {
          _id
          deliveryAddress
          details
          label
          id
          location {
            coordinates
          }
        }
        items {
          _id
          food
          title
          description
          image
          quantity
          specialInstructions
          isActive
          foodImage
          foodTitle
          variationImage
          variationTitle
          variationTotal
          foodQuantity
          variation {
            title
            image
            price
            discounted
            _id
            createdAt
            updatedAt
          }
          addons {
            title
            description
            quantityMinimum
            quantityMaximum
            isActive
            options {
              title
              description
              price
              isActive
            }
          }
        }
      }
    }
  }
`,(0,r.J1)`
  query SingleVendorOrderTracking($id: ID!) {
    orderTracking(id: $id) {
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
        phase
        source
        readyAt
        baseArrivalAt
        estimatedArrivalAt
        windowStartAt
        windowEndAt
        durationSeconds
        distanceMeters
        encodedPolyline
        calculatedAt
        lastLocationAt
        version
        origin {
          latitude
          longitude
        }
        destination {
          latitude
          longitude
        }
      }
    }
  }
`,(0,r.J1)`
  subscription SingleVendorOrderTrackingUpdated($id: String!) {
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
        phase
        source
        readyAt
        baseArrivalAt
        estimatedArrivalAt
        windowStartAt
        windowEndAt
        durationSeconds
        distanceMeters
        encodedPolyline
        calculatedAt
        lastLocationAt
        version
        origin {
          latitude
          longitude
        }
        destination {
          latitude
          longitude
        }
      }
    }
  }
`},18761:(e,t,i)=>{i.d(t,{C3:()=>r.C3,CY:()=>r.CY,Cf:()=>r.Cf,Dw:()=>r.Dw,E4:()=>r.E4,Ec:()=>r.Ec,HC:()=>a.HC,Kk:()=>r.Kk,Nj:()=>a.Nj,OJ:()=>a.OJ,Ou:()=>r.Ou,P2:()=>a.P2,Qw:()=>a.Qw,S3:()=>r.S3,Y8:()=>r.Y8,ZZ:()=>a.ZZ,Ze:()=>r.Ze,Zh:()=>r.Zh,Zt:()=>r.Zt,bg:()=>a.bg,eq:()=>r.eq,gf:()=>a.gf,hO:()=>r.hO,ox:()=>r.ox,p6:()=>a.p6,pc:()=>a.pc,rw:()=>a.rw,s_:()=>r.s_,se:()=>r.se,vh:()=>a.vh,xz:()=>a.xz,zY:()=>r.zY});var r=i(35036),a=i(15383)},25095:(e,t,i)=>{i.d(t,{DS:()=>g,Xb:()=>p,Yq:()=>m,ko:()=>u,m9:()=>function e(t=(0,r.FD)()){let i=s();if(!i)return null;let o=i.getItem(l(a,t));return o||(u(t),e(t))},oV:()=>c});var r=i(89561);let a="_px3k9",o="_zt7m2",d="_qw4v8",n="_rf8n1";function s(){return window.localStorage}let l=(e,t)=>(0,r.cX)(e,t);function u(e=(0,r.FD)()){let t=s();if(t&&!t.getItem(l(a,e))){let i,r=(i=new Uint8Array(16),crypto.getRandomValues(i),Array.from(i,e=>e.toString(16).padStart(2,"0")).join(""));t.setItem(l(a,e),r)}}function c(e,t,i=(0,r.FD)()){let a=s();a&&(a.setItem(l(o,i),e),a.setItem(l(d,i),t),a.setItem(l(n,i),Date.now().toString()))}function p(e=(0,r.FD)()){return s()?.getItem(l(o,e))??null}function m(e=(0,r.FD)()){let t=s();if(!t)return!1;let i=t.getItem(l(o,e)),a=t.getItem(l(d,e)),u=t.getItem(l(n,e));if(!i||!a)return!0;let c=new Date(a).getTime(),p=Date.now();return!!(p>=c)||!!(p>=c-1e4)&&(!u||p-parseInt(u,10)>=5e3)}function g(e=(0,r.FD)()){let t=s();t&&(t.removeItem(l(a,e)),t.removeItem(l(o,e)),t.removeItem(l(d,e)),t.removeItem(l(n,e)))}},30561:(e,t,i)=>{i.d(t,{K:()=>d,L:()=>n});var r=i(16261),a=i(87358);let o=(e="")=>e.endsWith("/graphql")?e:`${e.replace(/\/$/,"")}/graphql`,d=()=>(0,r.Iu)()===r.Pg.SINGLE||!0,n=e=>{let t=e===r.Pg.SINGLE,i=t?a.env.NEXT_PUBLIC_SINGLE_VENDOR_SERVER_URL:a.env.NEXT_PUBLIC_SERVER_URL,d=t?a.env.NEXT_PUBLIC_SINGLE_VENDOR_WS_SERVER_URL:a.env.NEXT_PUBLIC_WS_SERVER_URL,n=t&&a.env.NEXT_PUBLIC_SINGLE_VENDOR_REST_URL||i;return{mode:e,graphqlUrl:o(i),websocketUrl:o(d),restUrl:((e="")=>e?`${e.replace(/\/$/,"")}/`:"")(n),publicAccessRequired:!0}}},35036:(e,t,i)=>{i.d(t,{cK:()=>h,Y8:()=>o,Ze:()=>$,Zt:()=>I,fJ:()=>n,C3:()=>d,ox:()=>l,s_:()=>m,S3:()=>s,Kk:()=>u,Dw:()=>_,Ou:()=>g,Zh:()=>y,Cf:()=>a,CY:()=>c,eq:()=>p,se:()=>A,zY:()=>S,Ec:()=>v,E4:()=>f,hO:()=>T});var r=i(16763);let a=(0,r.J1)`
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
`,o=(0,r.J1)`
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
`,d=(0,r.J1)`
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
`,n=(0,r.J1)`
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
`,s=(0,r.J1)`
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
`,y=(0,r.J1)`
  mutation ResetPassword($password: String!, $email: String!, $token: String!) {
    resetPassword(password: $password, email: $email, token: $token) {
      result
    }
  }
`,$=(0,r.J1)`
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
`,A=(0,r.J1)`
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
`,I=(0,r.J1)`
  mutation DeactivateUser($isActive: Boolean!, $email: String!) {
    Deactivate(isActive: $isActive, email: $email) {
      _id
      name
      email
      isActive
    }
  }
`,v=(0,r.J1)`
  mutation VerifyOtp($otp: String!, $email: String, $phone: String) {
    verifyOtp(otp: $otp, email: $email, phone: $phone) {
      result
    }
  }
`,S=(0,r.J1)`
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
`,f=(0,r.J1)`mutation SaveNotificationTokenWeb($token:String!){
    saveNotificationTokenWeb(token:$token){
      success
      message
    }
  }`,T=(0,r.J1)` mutation updateNotificationStatus($orderNotification: Boolean!, $offerNotification: Boolean! ) {
   updateNotificationStatus(offerNotification:$offerNotification,orderNotification:$orderNotification){
    name,
    phone,
   }
  }
`,_=(0,r.J1)`
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
`,h=(0,r.J1)`
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
`},53640:(e,t,i)=>{i.d(t,{p:()=>a});var r=i(89561);let a=(e,t,i="")=>{switch(e){case"get":try{return r.vi.get(t)}catch(e){return""}case"save":try{return r.vi.set(t,i),t}catch(e){return""}case"delete":try{return r.vi.remove(t),t}catch(e){return""}default:return""}}},56788:(e,t,i)=>{i.d(t,{LT:()=>a.L,Pg:()=>r.Pg,U6:()=>n.U6,mC:()=>d.mC,q:()=>n.q,qt:()=>n.qt,vi:()=>o.vi,xz:()=>r.xz});var r=i(16261),a=i(30561),o=i(89561),d=i(59386),n=i(74203)},59386:(e,t,i)=>{i.d(t,{I1:()=>d,ZR:()=>s,mC:()=>n});var r=i(16261);let a=[/^\/restaurants/,/^\/store/,/^\/mapview/,/^\/restaurantInfo/],o=[/^\/deals/,/^\/browse/,/^\/product\//,/^\/profile\/(favorites|vouchers|wallet|membership|referral)/],d=(e,t)=>!(t===r.Pg.SINGLE?a:o).some(t=>t.test(e)),n=e=>e===r.Pg.SINGLE?"/discovery":"/",s=e=>n(e)},68715:(e,t,i)=>{i.d(t,{Lr:()=>u,Rz:()=>n,iD:()=>s,kO:()=>l});var r=i(25095),a=i(89561);let o={TOKEN:"token",USER_TYPE:"userType",USER_ID:"userId",TOKEN_EXPIRATION:"tokenExpiration"},d=["userToken","userAddress","searchedKeywords","restaurant","cartItems","newOrderInstructions","orderInstructions","applied_coupon","coupon_text","is_coupon_applied","coupon_restaurant_id","pending_stripe_order_id","pending_stripe_started_at"];function n(e,t=(0,a.FD)()){e.token&&a.vi.set(o.TOKEN,e.token,t),e.userType&&a.vi.set(o.USER_TYPE,e.userType,t),e.userId&&a.vi.set(o.USER_ID,e.userId,t),e.tokenExpiration&&a.vi.set(o.TOKEN_EXPIRATION,String(e.tokenExpiration),t)}function s(e=(0,a.FD)()){return a.vi.get(o.TOKEN,e)??""}function l(e=(0,a.FD)()){return!!a.vi.get(o.TOKEN,e)}function u(e=(0,a.FD)()){!function(e=(0,a.FD)()){!function(e=(0,a.FD)()){Object.values(o).forEach(t=>a.vi.remove(t,e))}(e),d.forEach(t=>a.vi.remove(t,e)),(0,r.DS)(e)}(e)}},74203:(e,t,i)=>{i.d(t,{U6:()=>c,q:()=>p,qt:()=>m});var r=i(95155),a=i(73321),o=i(12115),d=i(16261),n=i(30561),s=i(89561),l=i(59386);let u=(0,o.createContext)(null);function c({children:e}){let t=(0,a.useRouter)(),[i,p]=(0,o.useState)(d.ED),[m,g]=(0,o.useState)(!1),[y,$]=(0,o.useState)(!1),[A,I]=(0,o.useState)(0),v=(0,o.useRef)(new Set),S=(0,d.Iu)(),f=null===S,T=(0,n.K)();(0,o.useEffect)(()=>{(0,s.fT)();let e=window.localStorage.getItem(d.YB);if(S){s.vi.set(d.YB,S),p(S),g(!0);return}let t=(0,d.xz)(e)?e:d.ED;t!==d.Pg.SINGLE||T?p(t):(s.vi.set(d.YB,d.Pg.MULTI),p(d.Pg.MULTI)),g(!0)},[S,T]);let _=(0,o.useCallback)(async e=>{if(!(0,d.xz)(e)||!f||e===i||v.current.size>0||e===d.Pg.SINGLE&&!T)return!1;$(!0);try{return s.vi.set(d.YB,e),p(e),t.replace((0,l.ZR)(e)),!0}finally{$(!1)}},[f,i,t,T]),h=(0,o.useCallback)(()=>{let e=Symbol("mode-sensitive-operation");return v.current.add(e),I(v.current.size),()=>{v.current.delete(e),I(v.current.size)}},[]),w=(0,o.useMemo)(()=>({mode:i,isModeReady:m,isSwitchingMode:y,isModeSwitchBlocked:A>0,singleVendorAvailable:T,isModeToggleEnabled:f,isSingleVendor:i===d.Pg.SINGLE,switchMode:_,beginModeSensitiveOperation:h}),[i,m,y,A,T,f,_,h]);return(0,r.jsx)(u.Provider,{value:w,children:e})}let p=()=>{let e=(0,o.useContext)(u);if(!e)throw Error("useAppMode must be used inside AppModeProvider");return e},m=e=>{let{beginModeSensitiveOperation:t}=p();(0,o.useEffect)(()=>e?t():void 0,[e,t])}},89561:(e,t,i)=>{i.d(t,{FD:()=>d,cX:()=>n,fT:()=>l,vi:()=>s});var r=i(16261);let a=new Set([r.YB,"theme","locale","NEXT_LOCALE","messaging-token","pendingOrderNavigation","knownOrderOrigins"]),o=["token","userType","userId","tokenExpiration","userToken","userAddress","location","restaurant","restaurant-slug","restaurantData","cartItems","cart-product-store-id","cart-product-store-slug","currentShopType","newOrderInstructions","orderInstructions","applied_coupon","coupon_text","is_coupon_applied","coupon_restaurant_id","pending_stripe_order_id","pending_stripe_started_at","searchedKeywords"],d=()=>{let e=window.localStorage.getItem(r.YB);return(0,r.xz)(e)?e:r.ED},n=(e,t=d())=>a.has(e)?e:`@enatega/${t.toLowerCase()}/${e}`,s={get:(e,t)=>window.localStorage.getItem(n(e,t)),set(e,t,i){window.localStorage.setItem(n(e,i),t)},remove(e,t){window.localStorage.removeItem(n(e,t))}},l=()=>{let e="@enatega/multi/storage-migrated-v1";if("true"!==window.localStorage.getItem(e)){for(let e of o){let t=window.localStorage.getItem(e),i=n(e,r.Pg.MULTI);null!==t&&null===window.localStorage.getItem(i)&&window.localStorage.setItem(i,t)}window.localStorage.setItem(e,"true")}}}}]);