const buses = 
    /*
    1. Dome - Madina
    2. Madina - Osu
    3. Atomic Junction - Accra Central
    4. 37 - Dodowa
    5. Lapaz - Mallam
    6. 37 - Circle
    7. Circle - Kasoa
    8. Haatso - Boshe
    9. Lapaz - Tema
    10. Ofankor - Dome
  
    db pass = mr8xurlcGEYQBZix
    connection string = mongodb+srv://basiccode0:mr8xurlcGEYQBZix@cluster0.0isccfy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    
    mongodb+srv://basiccode0:<password>@cluster0.0isccfy.mongodb.net/
  
    */

    [
      {
        "busId": 0,
        "startStation": "madina",
        "endStation": "dome",
        location: {lat: 5.6704396, lng: -0.175743129},
        "timeAway": "9min"
      },
      { // test
        "busId": 10,
        "startStation": "madina",
        "endStation": "acity",
        location: {lat: 5.6704396, lng: -0.175743129},
        "timeAway": "9min"
      },
      { // test
        "busId": 11,
        "startStation": "madina",
        "endStation": "lapaz",
        location: {lat: 5.6704396, lng: -0.175743129},
        "timeAway": "9min"
      },
      {
        "busId": 1,
        "startStation": "madina",
        "endStation": "osu",
        "location": {"lat": 5.00003, "lng": 0.00002},
        "timeAway": "5min"
      },
      {
        "busId": 2,
        "startStation": "atomic junction",
        "endStation": "accra central",
        "location": {"lat": 5.00001, "lng": 0.00004},
        "timeAway": "9min"
      },
      {
        "busId": 3,
        "startStation": "37",
        "endStation": "dodowa",
        "location": {"lat": 4.99999, "lng": 0.00004},
        "timeAway": "10min"
      },
      {
        "busId": 4,
        "startStation": "lapaz",
        "endStation": "mallam",
        "location": {"lat": 4.99991, "lng": 0.00006},
        "timeAway": "8min"
      },
      {
        "busId": 5,
        "startStation": "37",
        "endStation": "circle",
        "location": {"lat": 5.00006, "lng": -0.00009},
        "timeAway": "7min"
      },
      {
        "busId": 6,
        "startStation": "circle",
        "endStation": "kasoa",
        "location": {"lat": 4.99998, "lng": 0.0},
        "timeAway": "8min"
      },
      {
        "busId": 7,
        "startStation": "haatso",
        "endStation": "boshe",
        "location": {"lat": 4.99997, "lng": -0.00003},
        "timeAway": "7min"
      },
      {
        "busId": 8,
        "startStation": "lapaz",
        "endStation": "tema",
        "location": {"lat": 4.9999, "lng": -0.00008},
        "timeAway": "8min"
      },
      {
        "busId": 9,
        "startStation": "ofankor",
        "endStation": "dome",
        "location": {"lat": 4.99999, "lng": 0.0},
        "timeAway": "10min"
      }
    ]
    
  
    // [
    //   {"busId": 0, "startStation": "madina", "endStation": "dome", "location": (4.99999, 0.0001), "timeAway": "9min"},
    //   {"busId": 1, "startStation": "madina", "endStation": "osu", "location": (5.00003, 0.00002), "timeAway": "5min"},
    //   {"busId": 2, "startStation": "atomic junction", "endStation": "accra central", "location": (5.00001, 0.00004), "timeAway": "9min"},
    //   {"busId": 3, "startStation": "37", "endStation": "dodowa", "location": (4.99999, 0.00004), "timeAway": "10min"},
    //   {"busId": 4, "startStation": "lapaz", "endStation": "mallam", "location": (4.99991, 0.00006), "timeAway": "8min"},
    //   {"busId": 5, "startStation": "37", "endStation": "circle", "location": (5.00006, -0.00009), "timeAway": "7min"},
    //   {"busId": 6, "startStation": "circle", "endStation": "kasoa", "location": (4.99998, 0.0), "timeAway": "8min"},
    //   {"busId": 7, "startStation": "haatso", "endStation": "boshe", "location": (4.99997, -0.00003), "timeAway": "7min"},
    //   {"busId": 8, "startStation": "lapaz", "endStation": "tema", "location": (4.9999, -0.00008), "timeAway": "8min"},
    //   {"busId": 9, "startStation": "ofankor", "endStation": "dome", "location": (4.99999, 0.0), "timeAway": "10min"}
  
    // ]
    

  export { buses }