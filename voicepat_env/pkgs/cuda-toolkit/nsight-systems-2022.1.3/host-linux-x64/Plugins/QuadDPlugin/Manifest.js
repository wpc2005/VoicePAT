// DO NOT MODIFY.
// This file was created automatically by CMake.

// QuadDPlugin is the primary UI library for the product.
AppLib.logInfo("Loading QuadDPlugin");

var states = {
    ShowProjectExplorer: "$$.ShowProjectExplorer",
};

addPlugin({
    pluginDependencies: ["CorePlugin"],
    pluginLibrary: "QuadDPlugin",

    layouts: {
        "default": "Plugins/$$/default.layout",
    },

    hostApplication: {
        title: qsTr("NVIDIA Nsight Systems"),
        version: "2022.1.3",
        defaultWidth: 1366,
        defaultHeight: 768,
        multiTargetEnabled: "false",
        usbTargetsEnabled: "false",
        queryEnabled: "true",
        icon: ":/icons/Product.png",
        docs: "http://docs.nvidia.com/nsight-systems/index.html",
        offlineDocs: "documentation/index.html",
        crashReporterHideStack: true,

        productName: "NVIDIA Nsight Systems",
        organizationName: "NVIDIA Corporation",

        versionUpdates: {
            enabled: true,
            tableUrl: "https://developer.download.nvidia.com/NsightSystems/VersionUpgrades-CTK.json",
        },

        commandBars: {
            "$$.FileMenu": { order: 100 },
            "$$.ViewMenu": { order: 200 },
            "CorePlugin.ToolsMenu": { order: 300 },
            "$$.HelpMenu": { order: 9999 },
        },
    },

    commandLineOptions:
    {
        "operation":
        {
            name: "operation",
            description: "Operation performed with the project",
            valueName: "operation",
        },
        "project-uuid":
        {
            name: "project-uuid",
            description: "UUID of the project which should be opened or created",
            valueName: "project-uuid",
        },
        "working-dir":
        {
            name: "working-dir",
            description: "Working directory of the profiled application",
            valueName: "working-dir",
        },
        "target-path":
        {
            name: "target-path",
            description: "Path to the main binary of the profiled application",
            valueName: "target-path",
        },
        "target-environment":
        {
            name: "target-environment",
            description: "Environment to the profiled application",
            valueName: "target-path",
        },
        "start-args":
        {
            name: "start-args",
            description: "Arguments passed to the profiled application",
            valueName: "start-args",
        },
        "solution-path":
        {
            name: "solution-path",
            description: "Path of the profiled application's Visual Studio solution",
            valueName: "solution-path",
        },
       "screenshot":
        {
            name: "screenshot",
            description: "Take a screenshot of the loaded report and quit",
        },
        "$$.SingleProcess":
        {
            name: "single-process",
            description: "Use single-process mode for QtWebEngine.",
        },
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
            "etl":
            {
                icon: "",
                factoryName: "ReportFactory",
                viewFactories:
                [
                    { factoryName: "ReportWindowFactory", priority: 50 }
                ]
            },
            "qdresolve":
            {
                icon: "",
                factoryName: "ReportFactory",
                viewFactories:
                [
                    { factoryName: "ReportWindowFactory", priority: 50 }
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
            "qdlaunch":
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
            "qdexport":
            {
                icon: "",
                factoryName: "ExportSelectorFactory",
                viewFactories:
                [
                    { factoryName: "ExportSelectorWindowFactory", priority: 50 }
                ]
            },
        },
        fileFilters: {
            "Projects": { extensions: ["qdproj"], sortPriority: 50 },
            "Reports":
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

    toolWindows: {
        "$$.ProjectExplorerWindow": {
            text: qsTr("Project Explorer"),
            sizeMode: "percent",
            deleteOnClose: true,
            layout: "dockWest",
            isFixed: false,
            persistable: true,
            defaultWidth: 250,
            commandBars: {
            },
        }

    },

    commands: {
        "$$.RestoreDefaultLayout": {
            text: qsTr("&Restore Default Layout"),
        },
        "$$.SaveLayout": {
            text: qsTr("Save Layout"),
            shortcut: codeTr("Alt+Shift+S"),
        },
        "$$.NewProject": {
            text: qsTr("&New Project"),
            shortcut: codeTr("Ctrl+N"),
        },
        "$$.OpenFile": {
            text: qsTr("&Open..."),
            shortcut: codeTr("Ctrl+O"),
        },
        "$$.LoadTile": {
            text: qsTr("&Add Report (beta)..."),
            shortcut: codeTr("Ctrl+T"),
        },
        "$$.Import": {
            text: qsTr("&Import..."),
            shortcut: codeTr("Ctrl+I"),
        },
        "$$.Export": {
            text: qsTr("&Export..."),
            shortcut: codeTr("Ctrl+E"),
        },
        "$$.SaveFileAs": {
            text: qsTr("Save &As..."),
            shortcut: codeTr("Ctrl+Shift+S"),
            enabled: false,
        },
        "$$.ShowProjectExplorer": {
            text: qsTr("&Show Project Explorer"),
            checkedWithFlags: [states.ShowProjectExplorer],
        },
        "$$.OptionsPresetCommand": {
            text: qsTr("Options Preset..."),
        },
        "$$.OfflineDocumentationCommand": {
            text: qsTr("Offline Documentation..."),
        },
        "$$.ShowAboutWindow": {
            text: qsTr("&About"),
        },
        "$$.ShowRebelDialog": {
            text: qsTr("&Settings to Analyze CUDA Kernels..."),
        },
        "$$.ShowPreferencesWindow": {
            text: qsTr("&Preferences..."),
        },
    },

    commandGroups: {
        "$$.ProjectGroup": {
            "$$.NewProject": { order: 100 },
            "$$.OpenFile": { order: 200 },
            "$$.LoadTile": { order: 250 },
            "$$.Import": { order: 300 },
            "$$.Export": { order: 400 },
        },
        "$$.FileGroup": {
            "CorePlugin.CloseFile": { order: 150 },
        },
        "$$.ViewToolWindowsGroup": {
            "$$.ShowProjectExplorer": { order: 100 },
        },
        "CorePlugin.SettingsGroup": {
            "$$.OptionsPresetCommand": { order: 90 },
        },
        "$$.DocumentationGroup": {
            "CorePlugin.DocumentationCommand": { order: 100 },
            "$$.OfflineDocumentationCommand": { order: 150 },
            "CorePlugin.CheckForUpdatesCommand": {order: 200},
        },
        "$$.AboutGroup": {
            "$$.ShowAboutWindow": { order: 100 },
        },
        "$$.RebelPreferencesGroup": {
            "$$.ShowRebelDialog": { order: 100 },
        },
        "$$.LayoutGroup": {
            "$$.RestoreDefaultLayout": { order: 110 },
            "$$.SaveLayout": { order: 120 },
            "CorePlugin.ApplyWindowLayout": { order: 130 },
        }
    },

    commandBars: {
        "$$.FileMenu": {
            type: "menu",
            text: qsTr("&File"),
            commandGroups: {
                "$$.ProjectGroup": { order: 100 },
                "$$.FileGroup": { order: 150 },
                "CorePlugin.ExitGroup": { order: 200 },
            },
        },
        "$$.ViewMenu": {
            type: "menu",
            text: qsTr("&View"),
            commandGroups: {
                "$$.ViewToolWindowsGroup": { order: 100 },
                "$$.LayoutGroup": { order: 210 },
            },
        },
        "$$.HelpMenu": {
            type: "menu",
            text: qsTr("&Help"),
            commandGroups: {
                "$$.DocumentationGroup": { order: 100 },
                "CorePlugin.FeedbackGroup": { order: 120 },
                "$$.AboutGroup": { order: 130 },
            },
        },
        "CorePlugin.ToolsMenu": {
            type: "menu",
            text: qsTr("&Tools"),
            commandGroups: {
                "$$.RebelPreferencesGroup": { order: 130 },
            },
        },

        feedback: {
            mailingAddress: "nsight-systems-feedback@exchange.nvidia.com",
        },
    },

    timelineHelp: {
        title: "Timeline Actions and Gestures",
        description: "When navigating the Timeline you can use keyboard shortcuts and mouse gestures. " +
            "If your machine is equipped with a touchpad, you can also use touchpad gestures to " +
            "pan, zoom and scroll vertically.\n\n" +
            "The tables below show a description of common actions with their gesture bindings.",

        shortcutGroups: [{
            title: "Show This Dialog",
            description: "Press the '?' key when Timeline is in focus."
        },
        {
            title: "Navigation with Keyboard and Mouse",
            description: "Here are combinations to use keyboard and mouse to scroll through the Timeline and the tree.",
            shortcuts: [{
                id: "Navigation.PanLeft",
                name: "Pan Left",
                combinations: {
                    common: ["LeftArrow"]
                }
            },
            {
                id: "Navigation.PanRight",
                name: "Pan Right",
                combinations: {
                    common: ["RightArrow"]
                }
            },
            {
                id: "Navigation.ZoomInX",
                name: "Zoom in X-axis",
                combinations: {
                    common: ["Keyboard +", "Keyboard ="],
                    windows: ["CTRL + MouseWheel up"],
                    linux: ["CTRL + MouseWheel up"],
                    macos: ["Cmd + MouseWheel up"]
                }
            },
            {
                id: "Navigation.ZoomOutX",
                name: "Zoom out X-axis",
                combinations: {
                    common: ["Keyboard -"],
                    windows: ["CTRL + MouseWheel down"],
                    linux: ["CTRL + MouseWheel down"],
                    macos: ["Cmd + MouseWheel down"],
                }
            },
            {
                id: "Navigaton.NextRow",
                name: "Next Row",
                combinations: {
                    common: ["ArrowDown"]
                }
            },
            {
                id: "Navigaton.PrevRow",
                name: "Previous Row",
                combinations: {
                    common: ["ArrowUp"]
                }
            },
            {
                id: "Navigation.Undo",
                name: "Undo a Navigation Step",
                combinations: {
                    common: ["Backspace"]
                }
            }]
        },
        {
            title: "Navigation with Touchpad",
            description: "Navigating through the Timeline and the tree with touchpad.",
            shortcuts: [{
                id: "Navigation.PanLeft",
                name: "Pan Left",
                combinations: {
                    common: ["Swipe right with two fingers"]
                }
            },
            {
                id: "Navigation.PanRight",
                name: "Pan Right",
                combinations: {
                    common: ["Swipe left with two fingers"]
                }
            },
            {
                id: "Navigation.ZoomInX",
                name: "Zoom in X-axis",
                combinations: {
                    common: ["Pinch in with touchpad"]
                }
            },
            {
                id: "Navigation.ZoomOutX",
                name: "Zoom out X-axis",
                combinations: {
                    common: ["Pinch out with touchpad"]
                }
            },
            {
                id: "Navigaton.ScrollUp",
                name: "Scroll Tree Up",
                combinations: {
                    common: ["Swipe down with two fingers"]
                }
            },
            {
                id: "Navigaton.ScrollDown",
                name: "Scroll Tree Down",
                combinations: {
                    common: ["Swipe up with two fingers"]
                }
            }]
        },
        {
            title: "Selection of Items",
            description: "You can select an item on the Timeline. " +
                "Selecting items with double-click synchronizes the Timeline and the Events View",

            shortcuts: [{
                id: "Selection.SelectItem",
                name: "Select an Item in the Timeline",
                combinations: {
                    common: ["MouseLeftClick on an item"]
                }
            },
            {
                id: "Selection.SelectItemInEventsView",
                name: "Select an Item in the Events View",
                combinations: {
                    common: ["MouseLeftDoubleClick on an item"]
                }
            },
            {
                id: "Selection.FitItemToScreen",
                name: "Select and Fit an Item to Screen",
                combinations: {
                    windows: ["CTRL + MouseLeftDoubleClick on an item"],
                    linux: ["CTRL + MouseLeftDoubleClick on an item"],
                    macos: ["Cmd + MouseLeftDoubleClick on an item"]
                }
            }]
        },
        {
            title: "Selection of a Time Range",
            description: "You can select an time range on the Timeline. " +
                "The selected area and its borders can be dragged with left mouse button. " +
                "Also it has several shortcuts modifying zoom level and time filter.",

            shortcuts: [{
                id: "Selection.SelectTimeRange",
                name: "Select a Time Range",
                combinations: {
                    common: ["Press and drag left mouse button"]
                }
            },
            {
                id: "Selection.SelectTimeRange",
                name: "Drag Selection or Its Border",
                combinations: {
                    common: ["Press and drag left mouse button on a selection"]
                }
            },
            {
                id: "Selection.Deselect",
                name: "Deselect a Time Range",
                combinations: {
                    common: ["Escape", "Click outside a selection"]
                }
            },
            {
                id: "Selection.Zoom",
                name: "Zoom into a Selection",
                combinations: {
                    common: ["Z"]
                }
            },
            {
                id: "Selection.ZoomAndDeselect",
                name: "Zoom into a Selection and Deselect",
                combinations: {
                    common: ["Shift + Z", "MouseLeftDoubleClick on a selection"]
                }
            },
            {
                id: "Selection.Filter",
                name: "Apply Time Filter",
                combinations: {
                    common: ["F"]
                }
            },
            {
                id: "Selection.FilterAndDeselect",
                name: "Apply Time Filter and Deselect",
                combinations: {
                    common: ["Shift + F"]
                }
            }]
        }]
    },

    settings: {
        "$$.ReportBehavior": {
            order: 100,
            text: qsTr("Report Behavior"),
            detailsText: qsTr("You need to reopen report(s) in order for the change of this " +
                "settings to take effect"),
            properties: {
                "QuadDPlugin.UseCudaNvtxGroups": {
                    order: 105,
                    type: "bool",
                    category: qsTr("Report Behaviour"),
                    text: qsTr("Rename CUDA Kernels by NVTX"),
                    detailsText: qsTr("Rename CUDA Kernels by NVTX ranges."),
                    defaultValue: false
                },
                "QuadDPlugin.TimelineMode": {
                    order: 106,
                    type: "enum",
                    enumValues: {
                        "defaultMode": {
                            order: 100,
                            text: qsTr("CPU rows on top"),
                        },
                        "gpuOnTopMode": {
                            order: 101,
                            text: qsTr("GPU rows on top"),
                        },
                    },
                    category: qsTr("Report Behaviour"),
                    text: qsTr("Timeline mode"),
                    detailsText: qsTr("Switch timeline mode."),
                    defaultValue: "gpuOnTopMode"
                },
                "QuadDPlugin.SymbolSearchVerboseLog": {
                    order: 107,
                    type: "bool",
                    category: qsTr("Report Behaviour"),
                    text: qsTr("Symbol Search verbose log (Windows only)"),
                    detailsText: qsTr("Display the intermediate steps of the symbol search in" +
                        " the report's Symbol Resolution Log."),
                    defaultValue: false
                },

                "$$.VerticalScrolling": {
                    order: 200,
                    type: "bool",
                    category: qsTr("Vertical scrolling behaviour"),
                    text: qsTr("Scroll vertically when time filter is changed"),
                    detailsText: qsTr("Try to preserve visual context when time filter is applied"),
                    defaultValue: false
                },
            },
        },

        "$$.ProfileBehavior": {
            order: 101,
            text: qsTr("Profile Behavior"),
            detailsText: qsTr("You need to rerun trace(s) in order for the change of this " +
                "settings to take effect"),
            properties: {
                "QuadDPlugin.RetainETWLogFile": {
                    order: 100,
                    type: "bool",
                    visible: true,
                    category: qsTr("Profile Behaviour"),
                    text: qsTr("Save ETW log files in project folder (Windows only)"),
                    detailsText: qsTr("Keep ETL file. trace rerun required."),
                    defaultValue: true
                },
                "QuadDPlugin.AutomaticallyGenerateReportFileNames": {
                    order: 101,
                    type: "bool",
                    category: qsTr("Profile Behaviour"),
                    text: qsTr("Derive report file name from collected data (Windows only)"),
                    detailsText: qsTr("Use details of profiled graphics application. Format: " +
                        "[Process Name][GPU Name][Window Resolution][Graphics API] Timestamp.nsys-rep"),
                    defaultValue: false
                }
            }
        },
        
        "$$.OptionsPreset": {
            order: 150,
            text: qsTr("Options Preset"),
            detailsText: qsTr("Change of the preset may reconfigure your options"),
            properties: {
                "QuadDPlugin.OptionsPreset": {
                    order: 100,
                    type: "enum",
                    visible: false,
                    enumValues: {
                        "standardPreset": {
                            order: 101,
                            text: qsTr("Standard"),
                        },
                        "graphicsPreset": {
                            order: 102,
                            text: qsTr("Graphics"),
                        },
                    },
                    text: qsTr("Options Preset"),
                },
            },
        },

        // TODO (DTSP-2632): This is a workaround for this problem:
        // http://devtools-ru-s1.nvidia.com/gitlab/agora/quadd/merge_requests/4647#note_90779
        "CorePlugin.Privacy": {
            properties: {
                "CorePlugin.AllowAnalytics": {
                    category: qsTr("Help Improve NVIDIA Software    "),
                }
            }
        },

        "QuadDPlugin.Notifications": {
            text: qsTr("Notifications"),
            order: 140,

            properties: {
                "QuadDPlugin.ResetNotifications": {
                    category: qsTr("Reset All Notifications"),
                    type: "button",
                    detailsText: qsTr("Click to reset all notifications to the default state"),
                    text: qsTr("Reset notifications"),
                    consecutiveClick: false
                }
            }
        }
    }
});
