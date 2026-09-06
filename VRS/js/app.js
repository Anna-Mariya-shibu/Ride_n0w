// ===============================
// DEFAULT VEHICLES
// ===============================

const defaultVehicles = [
    {
        id: 1,
        name: "Honda Activa",
        type: "2W",
        fuel: "Petrol",
        price: 500
    },
    {
        id: 2,
        name: "Royal Enfield Classic",
        type: "2W",
        fuel: "Petrol",
        price: 900
    },
    {
        id: 3,
        name: "Yamaha R15",
        type: "2W",
        fuel: "Petrol",
        price: 1100
    },
    {
        id: 4,
        name: "Maruti Swift",
        type: "4W",
        fuel: "Petrol",
        price: 1800
    },
    {
        id: 5,
        name: "Hyundai Creta",
        type: "4W",
        fuel: "Diesel",
        price: 2500
    },
    {
        id: 6,
        name: "Toyota Innova",
        type: "4W",
        fuel: "Diesel",
        price: 3200
    }
];


// ===============================
// VEHICLE FUNCTIONS
// ===============================

function getVehicles() {

    const vehicles =
        localStorage.getItem("vehicles");

    if (vehicles) {
        return JSON.parse(vehicles);
    }

    return defaultVehicles;
}


function saveVehicles(vehicles) {

    localStorage.setItem(
        "vehicles",
        JSON.stringify(vehicles)
    );
}


// ===============================
// BOOKING FUNCTIONS
// ===============================

function getBookings() {

    const bookings =
        localStorage.getItem("bookings");

    if (bookings) {
        return JSON.parse(bookings);
    }

    return [];
}


function saveBookings(bookings) {

    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );
}


// ===============================
// ESCAPE HTML
// ===============================

function esc(value) {

    return String(value).replace(
        /[&<>"']/g,
        function (character) {

            const characters = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return characters[character];
        }
    );
}


// ===============================
// DISPLAY VEHICLES
// ===============================

function renderVehicles() {

    const vehicleList =
        document.getElementById("vehicleList");

    if (!vehicleList) {
        return;
    }


    const searchBox =
        document.getElementById("search");

    const typeBox =
        document.getElementById("type");


    const search = searchBox
        ? searchBox.value.toLowerCase()
        : "";


    const type = typeBox
        ? typeBox.value
        : "all";


    const vehicles = getVehicles();


    const filteredVehicles =
        vehicles.filter(function (vehicle) {

            const matchesSearch =
                vehicle.name
                    .toLowerCase()
                    .includes(search);


            const matchesType =
                type === "all" ||
                vehicle.type === type;


            return matchesSearch && matchesType;
        });


    if (filteredVehicles.length === 0) {

        vehicleList.innerHTML =
            "<p>No vehicles found.</p>";

        return;
    }


    vehicleList.innerHTML =
        filteredVehicles
            .map(function (vehicle) {

                const vehicleType =
                    vehicle.type === "2W"
                        ? "Two Wheeler"
                        : "Four Wheeler";


                return `
                    <div class="vehicle-card">

                        <h3>
                            ${esc(vehicle.name)}
                        </h3>

                        <p class="muted">
                            ${vehicleType}
                            •
                            ${esc(vehicle.fuel)}
                        </p>

                        <p class="price">
                            ₹${vehicle.price.toLocaleString()}
                            <small>/ day</small>
                        </p>

                        <p>
                            Weekly:
                            ₹${(vehicle.price * 6)
                                .toLocaleString()}

                            •

                            Monthly:
                            ₹${(vehicle.price * 24)
                                .toLocaleString()}
                        </p>

                        <a
                            class="btn primary"
                            href="booking.html?id=${vehicle.id}"
                        >
                            Book Now
                        </a>

                    </div>
                `;
            })
            .join("");
}


// ===============================
// SEARCH VEHICLES
// ===============================

const searchBox =
    document.getElementById("search");

if (searchBox) {

    searchBox.addEventListener(
        "input",
        renderVehicles
    );
}


// ===============================
// FILTER VEHICLES
// ===============================

const typeBox =
    document.getElementById("type");

if (typeBox) {

    typeBox.addEventListener(
        "change",
        renderVehicles
    );
}


renderVehicles();


// ===============================
// BOOKING PAGE
// ===============================

function setupBooking() {

    const bookingForm =
        document.getElementById("bookingForm");

    if (!bookingForm) {
        return;
    }


    const parameters =
        new URLSearchParams(
            window.location.search
        );


    const vehicleId =
        parameters.get("id");


    const vehicles =
        getVehicles();


    const vehicle =
        vehicles.find(function (item) {

            return String(item.id) ===
                String(vehicleId);

        }) || vehicles[0];


    const selectedVehicle =
        document.getElementById(
            "selectedVehicle"
        );


    selectedVehicle.innerHTML = `
        <strong>
            ${esc(vehicle.name)}
        </strong>

        <br>

        ${vehicle.type === "2W"
            ? "Two Wheeler"
            : "Four Wheeler"}

        •
        ${esc(vehicle.fuel)}

        •
        ₹${vehicle.price}/day
    `;


    const startDate =
        document.getElementById("startDate");

    const endDate =
        document.getElementById("endDate");

    const rentalPlan =
        document.getElementById("plan");

    const totalAmount =
        document.getElementById("total");


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    startDate.min = today;
    endDate.min = today;


    // ===============================
    // CALCULATE TOTAL
    // ===============================

    function calculateTotal() {

        if (
            !startDate.value ||
            !endDate.value
        ) {

            totalAmount.textContent =
                "Estimated total: ₹0";

            return;
        }


        const start =
            new Date(startDate.value);

        const end =
            new Date(endDate.value);


        const days =
            Math.ceil(
                (end - start) /
                (1000 * 60 * 60 * 24)
            );


        if (days <= 0) {

            totalAmount.textContent =
                "End date must be after start date.";

            return;
        }


        let amount =
            vehicle.price * days;


        if (rentalPlan.value === "weekly") {

            amount =
                vehicle.price *
                7 *
                Math.ceil(days / 7) *
                0.9;
        }


        if (rentalPlan.value === "monthly") {

            amount =
                vehicle.price *
                30 *
                Math.ceil(days / 30) *
                0.8;
        }


        totalAmount.textContent =
            "Estimated total: ₹" +
            Math.round(amount)
                .toLocaleString();
    }


    startDate.addEventListener(
        "change",
        calculateTotal
    );


    endDate.addEventListener(
        "change",
        calculateTotal
    );


    rentalPlan.addEventListener(
        "change",
        calculateTotal
    );


    // ===============================
    // SUBMIT BOOKING
    // ===============================

    bookingForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const start =
                new Date(startDate.value);

            const end =
                new Date(endDate.value);


            const days =
                Math.ceil(
                    (end - start) /
                    (1000 * 60 * 60 * 24)
                );


            if (
                !startDate.value ||
                !endDate.value ||
                days <= 0
            ) {

                const message =
                    document.getElementById(
                        "message"
                    );


                message.className =
                    "error";


                message.textContent =
                    "Please select valid dates.";

                return;
            }


            // ===============================
            // CHECK VEHICLE AVAILABILITY
            // ===============================

            const bookings =
                getBookings();


            const vehicleAlreadyBooked =
                bookings.some(
                    function (booking) {

                        if (
                            booking.vehicle !==
                            vehicle.name
                        ) {
                            return false;
                        }


                        const existingStart =
                            new Date(
                                booking.start
                            );


                        const existingEnd =
                            new Date(
                                booking.end
                            );


                        return (
                            start < existingEnd &&
                            end > existingStart
                        );
                    }
                );


            if (vehicleAlreadyBooked) {

                const message =
                    document.getElementById(
                        "message"
                    );


                message.className =
                    "error";


                message.textContent =
                    "Sorry, this vehicle is already booked for the selected dates.";

                return;
            }


            // ===============================
            // CALCULATE FINAL PRICE
            // ===============================

            let amount =
                vehicle.price * days;


            if (
                rentalPlan.value === "weekly"
            ) {

                amount =
                    vehicle.price *
                    7 *
                    Math.ceil(days / 7) *
                    0.9;
            }


            if (
                rentalPlan.value === "monthly"
            ) {

                amount =
                    vehicle.price *
                    30 *
                    Math.ceil(days / 30) *
                    0.8;
            }


            // ===============================
            // CREATE BOOKING
            // ===============================

            const newBooking = {

                id: Date.now(),

                vehicle:
                    vehicle.name,

                name:
                    document.getElementById(
                        "customerName"
                    ).value,

                email:
                    document.getElementById(
                        "email"
                    ).value,

                start:
                    startDate.value,

                end:
                    endDate.value,

                plan:
                    rentalPlan.value,

                total:
                    Math.round(amount),

                status:
                    "Pending"
            };


            bookings.push(newBooking);


            saveBookings(bookings);


            // ===============================
            // SUCCESS MESSAGE
            // ===============================

            const message =
                document.getElementById(
                    "message"
                );


            message.className =
                "success";


            message.textContent =
                "Booking submitted successfully! Go to My Bookings to view it.";


            bookingForm.reset();


            calculateTotal();
        }
    );
}


setupBooking();


// ===============================
// MY BOOKINGS
// ===============================

function renderBookings() {

    const bookingList =
        document.getElementById(
            "bookingList"
        );


    if (!bookingList) {
        return;
    }


    const bookings =
        getBookings();


    if (bookings.length === 0) {

        bookingList.innerHTML = `
            <div class="booking-card">

                No bookings yet.

                <a href="vehicles.html">
                    Browse vehicles
                </a>

            </div>
        `;

        return;
    }


    bookingList.innerHTML =
        bookings
            .slice()
            .reverse()
            .map(function (booking) {

                return `
                    <div class="booking-card">

                        <h3>
                            ${esc(booking.vehicle)}
                        </h3>

                        <p>
                            <strong>
                                Customer:
                            </strong>

                            ${esc(booking.name)}
                        </p>

                        <p>
                            ${esc(booking.start)}
                            to
                            ${esc(booking.end)}

                            •

                            ${esc(booking.plan)}
                        </p>

                        <p>
                            <strong>
                                Total:
                            </strong>

                            ₹${booking.total
                                .toLocaleString()}
                        </p>

                        <span class="status">
                            ${esc(booking.status)}
                        </span>

                    </div>
                `;

            })
            .join("");
}


renderBookings();


// ===============================
// LOGIN
// ===============================

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const role =
                document.getElementById(
                    "role"
                ).value;


            if (role === "agency") {

                window.location.href =
                    "agency.html";

            }

            else if (role === "admin") {

                window.location.href =
                    "admin.html";

            }

            else {

                window.location.href =
                    "vehicles.html";
            }
        }
    );
}


// ===============================
// AGENCY DASHBOARD
// ===============================

function setupAgency() {

    const vehicleForm =
        document.getElementById(
            "vehicleForm"
        );


    if (!vehicleForm) {
        return;
    }


    function refreshAgencyDashboard() {

        const vehicles =
            getVehicles();

        const bookings =
            getBookings();


        document.getElementById(
            "vehicleCount"
        ).textContent =
            vehicles.length;


        document.getElementById(
            "bookingCount"
        ).textContent =
            bookings.length;


        const bookingArea =
            document.getElementById(
                "agencyBookings"
            );


        if (bookings.length === 0) {

            bookingArea.innerHTML =
                "<p>No bookings.</p>";

            return;
        }


        bookingArea.innerHTML =
            bookings
                .slice()
                .reverse()
                .map(function (booking) {

                    return `
                        <div class="booking-card">

                            <strong>
                                ${esc(booking.vehicle)}
                            </strong>

                            <p>
                                ${esc(booking.name)}

                                •

                                ${esc(booking.start)}

                                to

                                ${esc(booking.end)}
                            </p>

                            <span class="status">
                                ${esc(booking.status)}
                            </span>

                        </div>
                    `;

                })
                .join("");
    }


    // ===============================
    // ADD VEHICLE
    // ===============================

    vehicleForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const vehicles =
                getVehicles();


            const newVehicle = {

                id: Date.now(),

                name:
                    document.getElementById(
                        "vName"
                    ).value,

                type:
                    document.getElementById(
                        "vType"
                    ).value,

                fuel:
                    document.getElementById(
                        "vFuel"
                    ).value,

                price:
                    Number(
                        document.getElementById(
                            "vPrice"
                        ).value
                    )
            };


            vehicles.push(newVehicle);


            saveVehicles(vehicles);


            vehicleForm.reset();


            refreshAgencyDashboard();


            alert(
                "Vehicle added successfully."
            );
        }
    );


    refreshAgencyDashboard();
}


setupAgency();


// ===============================
// ADMIN DASHBOARD
// ===============================

function setupAdmin() {

    const vehicleCount =
        document.getElementById(
            "adminVehicles"
        );


    if (!vehicleCount) {
        return;
    }


    const vehicles =
        getVehicles();

    const bookings =
        getBookings();


    vehicleCount.textContent =
        vehicles.length;


    document.getElementById(
        "adminBookings"
    ).textContent =
        bookings.length;


    const bookingList =
        document.getElementById(
            "adminBookingList"
        );


    if (bookings.length === 0) {

        bookingList.innerHTML =
            "<p>No bookings.</p>";

        return;
    }


    bookingList.innerHTML =
        bookings
            .slice()
            .reverse()
            .map(function (booking) {

                return `
                    <div class="booking-card">

                        <h3>
                            ${esc(booking.vehicle)}
                        </h3>

                        <p>
                            ${esc(booking.name)}
                            (${esc(booking.email)})
                        </p>

                        <p>
                            ${esc(booking.start)}
                            →
                            ${esc(booking.end)}

                            |

                            ₹${booking.total
                                .toLocaleString()}
                        </p>

                        <span class="status">
                            ${esc(booking.status)}
                        </span>

                    </div>
                `;

            })
            .join("");
}


setupAdmin();