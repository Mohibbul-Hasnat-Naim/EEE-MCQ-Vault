const MCQ_CONFIG = {
    app: {
        name: "EEE MCQ Vault",
        version: "1.0"
    },

    topics: [

        {
            id: "EM",
            name: "Electrical Machines",
            icon: "⚙️",
            folder: "electrical machines",

            subtopics: [
                { id: "TR", name: "Transformer", file: "transformer.json" },
                { id: "DCG", name: "DC Generator", file: "dc_generator.json" },
                { id: "ACG", name: "AC Generator / Alternator", file: "ac_generator_alternator.json" },
                { id: "DCM", name: "DC Motor", file: "dc_motor.json" },
                { id: "IM", name: "Induction Motor", file: "induction_motor.json" },
                { id: "SM", name: "Synchronous Motor", file: "synchronous_motor.json" }
                // { id: "SG", name: "Synchronous Generator", file: "synchronous_generator.json" }
            ]
        },
        
        {
            id: "ET",
            name: "Electronics",
            icon: "⚡",
            folder: "electronics",

            subtopics: [
                { id: "BJT", name: "BJT", file: "bjt.json" },
                { id: "DIO", name: "Diode & Semiconductor", file: "diode.json" },
                { id: "FET", name: "FET", file: "fet.json" },
                { id: "MOS", name: "MOSFET", file: "mosfet.json" },
                { id: "OA", name: "Operational Amplifier", file: "opamp.json" }
            ]
        },

        {
            id: "CS",
            name: "Control Systems",
            icon: "🎯",
            folder: "control system",

            subtopics: [
                { id: "BASIC", name: "Basic Concepts", file: "cs_basic.json" }
            ]
        },

        {
            id: "PS",
            name: "Power Systems",
            icon: "🔌",
            folder: "power system",

            subtopics: [
                { id: "TL", name: "Transmission Line", file: "transmission_line.json" }
            ]
        },

        {
            id: "CM",
            name: "Communication",
            icon: "🛰️",
            folder: "communication",

            subtopics: [
                { id: "MD", name: "Modulation", file: "modulation.json" }
            ]
        }

    ]
};

