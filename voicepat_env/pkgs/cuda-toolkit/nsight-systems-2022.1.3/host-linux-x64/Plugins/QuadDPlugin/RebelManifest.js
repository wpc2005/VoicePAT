// DO NOT MODIFY.
// This file was created automatically by CMake.

// QuadDPlugin is the primary UI library for the product.
AppLib.logInfo("Loading QuadDPlugin");

addPlugin({
    pluginDependencies: ["CorePlugin"],
    pluginLibrary: "QuadDPlugin",

    hostApplication: {
        isRunningUnderRebel: true,
    },

    documents:
    {
        fileTypes:
        {
            "qdrep":
            {
                icon: "",
                factoryName: "ReportFactory",
                viewFactories:
                [
                    { factoryName: "ReportWindowFactory", priority: 50 }
                ]
            },
            "nsys-rep":
            {
                icon: "",
                factoryName: "ReportFactory",
                viewFactories:
                [
                    { factoryName: "ReportWindowFactory", priority: 50 }
                ]
            },
            "qdstrm":
            {
                icon: "",
                factoryName: "ReportFactory",
                viewFactories:
                [
                    { factoryName: "ReportWindowFactory", priority: 50 }
                ]
            },
            "qdlaunch":
            {
                icon: "",
                factoryName: "ProjectFactory",
                viewFactories:
                [
                    { factoryName: "ProjectWindowFactory", priority: 50 }
                ]
            },
            "qdproj":
            {
                icon: "",
                factoryName: "ProjectFactory",
                viewFactories:
                [
                    { factoryName: "ProjectWindowFactory", priority: 50 }
                ]
            },
            "qdprogress":
            {
                icon: "",
                factoryName: "ProfilingProgressFactory",
                viewFactories:
                [
                    { factoryName: "ProfilingProgressWindowFactory", priority: 50 }
                ]
            },
        },
        fileFilters: {
            "Nsight Systems Reports":
            {
                extensions:
                [
                    "qdrep",
                    "nsys-rep"
                ],
                sortPriority: 50
            }
        }
    },
});
