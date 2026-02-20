// CorePlugin: Provides most of the common Agora UI elements.
// Prefer adding shared UI code to this plugin instead of the AppLib static library.
AppLib.logInfo("Loading CorePlugin");

// ----------------------------------------------------------------------------
// Important: These states need to match the ones defined in CoreStates.h.
// ----------------------------------------------------------------------------
var states = {
    IsConnected: "$$.IsConnected",
    IsDebugBuild: "$$.IsDebugBuild",
    IsExportLevelInternal: "$$.IsExportLevelInternal",
    IsExportLevelNDA: "$$.IsExportLevelNDA",
    InActivity: "$$.InActivity",
    IsLayoutManagementAvailable: "$$.IsLayoutManagementAvailable",
    IsLayoutManagementSupported: "$$.IsLayoutManagementSupported",
    HasMixedDPIScalingHandling: "$$.HasMixedDPIScalingHandling",
    HasOpenWindows: "$$.HasOpenWindows",
    HasSamples: "$$.HasSamples",
};

addPlugin({
    pluginDependencies: [],
    pluginLibrary: "CorePlugin", // Library suffix (.so, .dll) appended automatically
    pluginAvailableInCli: true,

    hostApplication: {
        defaultTheme: "Light",
    },

    commandLineOptions: {
        "$$.SharedInstance": {
            name: "shared-instance",
            valueName: "shared-instance",
            description: "Use a shared instance of the application. If a shared instance does not already exist, it will be created. Supported values are 1|0, true|false, on|off, yes|no.",
        },
        "$$.NoSplash": {
            name: "no-splash",
            description: "Suppresses the splash screen on startup",
        },
        "$$.Automated": {
            name: "automated",
            description: "Run in automated mode; either for tested or target initiated runs",
            hiddenFromHelp: "true",
        },
    },

    toolWindows: {
        "$$.LogWindow": {
            text: qsTr("Output Messages"),
            layout: "dockSouth",
            persistable: true,
            commandBars: {
                "$$.LogWindowToolbar": { order: 1000 }
            },
            properties: {
                columns: {
                    "ID": { visible: true },
                    "Type": { visible: true },
                    "Origin": { visible: true },
                    "Source": { visible: true },
                    "Message": { visible: true },
                },
            },
        },

        "$$.ProjectExplorer": {
            text: qsTr("Project Explorer"),
            layout: "dockWest",
            persistable: true,
            defaultWidth: 10,
        },

        "$$.DocumentsWindow": {
            text: qsTr("Documents"),
            sizeMode: "percent",
            defaultHeight: 50,
            defaultWidth: 50,
            isFixed: true,
            preservesContents: true,
            persistable: true,
            layout: "dockEast",
        },

        "$$.SecondaryDocumentsWindow": {
            text: qsTr("Documents"),
            sizeMode: "percent",
            defaultHeight: 50,
            defaultWidth: 50,
            isFixed: true,
            preservesContents: true,
            persistable: true,
            layout: "floating",
        },
    },

    documentWells: {
        main: {
            closeWhenEmpty: false
        },

        secondary: {
            // Not needed for now, but if needed later config could go here.
        },
    },

    commands: {

        // Project commands
        "$$.NewProject": {
            visibleWithFlags: ["CorePlugin.HasProjectService"],
            text: qsTr("New Project..."),
            importance: "high",
        },
        "$$.OpenProject": {
            visibleWithFlags: ["CorePlugin.HasProjectService"],
            text: qsTr("Open Project..."),
            imageFontIcon: "fa-folder-open",
            importance: "high",
        },
        "$$.SaveProject": {
            visibleWithFlags: ["CorePlugin.HasProjectService"],
            text: qsTr("Save Project"),
            imageFontIcon: "fa-save",
            importance: "high",
        },
        "$$.SaveProjectAs": {
            visibleWithFlags: ["CorePlugin.HasProjectService"],
            text: qsTr("Save Project As..."),
            importance: "high",
        },
        "$$.CloseProject": {
            visibleWithFlags: ["CorePlugin.HasProjectService"],
            text: qsTr("Close Project"),
            importance: "high",
        },
        "$$.RecentProjects": {
            visibleWithFlags: ["CorePlugin.HasProjectService", "CorePlugin.HasRecentFileService"],
            requiresFlags: [not(states.InActivity)],
            text: qsTr("Recent Projects"),
        },

        // Document commands
        "$$.NewFile": {
            text: qsTr("&New File..."),
            shortcut: codeTr("Ctrl+N"),
            importance: "high"
        },
        "$$.OpenFile": {
            text: qsTr("&Open File..."),
            imageFontIcon: "fa-folder-open",
            shortcut: codeTr("Ctrl+O"),
            importance: "high"
        },
        "$$.SaveFile": {
            text: qsTr("&Save File"),
            imageFontIcon: "fa-save",
            shortcut: codeTr("Ctrl+S"),
            importance: "high"
        },
        "$$.SaveFileAs": {
            text: qsTr("Save File &As..."),
            importance: "high"
        },
        "$$.SaveAllFiles": {
            text: qsTr("Save A&ll Files"),
            shortcut: codeTr("Ctrl+Shift+S"),
            importance: "high"
        },
        "$$.CloseFile": {
            text: qsTr("&Close File"),
            shortcut: codeTr("Ctrl+W"),
            importance: "high"
        },
        "$$.CloseAllFiles": {
            text: qsTr("Close All Files"),
            importance: "high"
        },
        "$$.RecentFiles": {
            visibleWithFlags: ["CorePlugin.HasRecentFileService"],
            text: qsTr("Recent Files"),
        },

        // General file commands
        "$$.ExitCommand": {
            text: qsTr("E&xit"),
            imageFontIcon: "fa-times-circle",
            shortcut: codeTr("Ctrl+Q"),
        },

        // Window commands
        "$$.SaveWindowLayout": {
            text: qsTr("Save Window Layout..."),
            requiresFlags: [states.IsLayoutManagementSupported],
            visibleWithFlags: [states.IsLayoutManagementAvailable],
        },
        "$$.ApplyWindowLayout": {
            text: qsTr("Apply Window Layout"),
            requiresFlags: [states.IsLayoutManagementSupported],
            visibleWithFlags: [states.IsLayoutManagementAvailable],
        },
        "$$.ManageWindowLayouts": {
            text: qsTr("Manage Window Layouts..."),
            requiresFlags: [states.IsLayoutManagementSupported],
            visibleWithFlags: [states.IsLayoutManagementAvailable],
        },
        "$$.RestoreDefaultLayout": {
            text: qsTr("Restore Default Layout"),
        },
        "$$.ChooseWindow": {
            text: qsTr("Windows..."),
            shortcut: codeTr("Ctrl+Shift+W"),
            requiresFlags: [states.HasOpenWindows],
        },

        // Connection commands
        // DEPRECATED: Prefer TPSConnectionPlugin
        "$$.ConnectCommand": {
            text: qsTr("&Connect..."),
            imageFontIcon: "fa-sign-in-alt",
            importance: "high",
            requiresFlags: [not(states.IsConnected)],
            shortcut: codeTr("Ctrl+Shift+C"),
        },
        "$$.DisconnectCommand": {
            text: qsTr("&Disconnect"),
            imageFontIcon: "fa-sign-out-alt",
            importance: "high",
            requiresFlags: [states.IsConnected],
            shortcut: codeTr("Ctrl+Shift+D"),
        },

        "$$.SettingsCommand": {
            text: qsTr("&Options..."),
            shortcut: codeTr("F7"),
        },
        "$$.ShowLogsCommand": {
            text: qsTr("Output &Messages"),
        },
        "$$.ShowDocumentWell": {
            text: qsTr("[Debug] Documents Well"),
            visibleWithFlags: [states.IsDebugBuild],
        },
        "$$.ExportLogsCommand": {
            text: qsTr("Export to CSV"),
            imageFontIcon: "fa-save",
        },
        "$$.ClearLogsCommand": {
            text: qsTr("Clear"),
            imageFontIcon: "fa-trash",
            importance: "high"
        },
        "$$.ShowInfoLogLevelCommand": {
            text: qsTr("Show &Info Messages"),
            image: codeTr(":/NV_UI/info.ico"),
            checked: true
        },
        "$$.ShowWarningLogLevelCommand": {
            text: qsTr("Show &Warning Messages"),
            image: codeTr(":/NV_UI/warning.ico"),
            checked: true
        },
        "$$.ShowErrorLogLevelCommand": {
            text: qsTr("Show &Error Messages"),
            image: codeTr(":/NV_UI/error.ico"),
            checked: true
        },
        "$$.ShowFatalLogLevelCommand": {
            text: qsTr("Show &Fatal Messages"),
            image: codeTr(":/NV_UI/fatal.ico"),
            checked: true
        },
        "$$.FilterLogSourceCommand": {
            text: qsTr("Filter &Sources:"),
            editable: true,
            type: "list",
            width: 30
        },
        "$$.SamplesCommand": {
            visibleWithFlags: ["CorePlugin.HasProjectService", states.HasSamples],
            requiresFlags: [not(states.InActivity)],
            text: qsTr("Samples"),
        },
        "$$.CheckForUpdatesCommand": {
            text: qsTr("&Check For Updates..."),
            visibleWithFlags: ["CorePlugin.HasVersionUpdateService"],
        },
        "$$.AboutCommand": {
            text: qsTr("&About..."),
            menuRole: "about",
        },
        "$$.DocumentationCommand": {
            text: qsTr("&Documentation..."),
        },
        "$$.FeedbackCommand": {
            text: qsTr("Send Feedbac&k..."),
            imageFontIcon: "fa-comment-alt",
        },
        "$$.SelectPreviousCommand": {
            text: qsTr("Select &Previous"),
            shortcut: codeTr("Ctrl+Left"),
        },
        "$$.SelectNextCommand": {
            text: qsTr("Select &Next"),
            shortcut: codeTr("Ctrl+Right"),
        },
        "$$.SelectFirstCommand": {
            text: qsTr("Select &First"),
            shortcut: codeTr("Ctrl+Home"),
        },
        "$$.SelectLastCommand": {
            text: qsTr("Select &Last"),
            shortcut: codeTr("Ctrl+End"),
        },
        "$$.ShowProjectExplorerCommand": {
            visibleWithFlags: ["CorePlugin.HasProjectService"],
            text: qsTr("Project Explorer"),
        },
        "$$.ResetAppDataCommand": {
            text: qsTr("Reset Application Data..."),
        },
        "$$.ShowWelcomePage": {
            text: qsTr("Show Welcome Page"),
            visibleWithFlags: ["CorePlugin.HasProjectService"],
        },
        "$$.ConsoleLaunch": {
            // Internal command, used when CorePlugin is ready in
            // a console host.
        },
    },

    commandGroups: {

        // NOTE: Not a default group in the FileMenu
        "$$.ProjectGroup": {
            "$$.NewProject": { order: 100 },
            "$$.OpenProject": { order: 110 },
            "$$.RecentProjects": { order: 120 },
            "$$.SaveProject": { order: 130 },
            "$$.SaveProjectAs": { order: 140 },
            "$$.CloseProject": { order: 150 },
        },

        // NOTE: Not a default group in the FileMenu
        "$$.FileGroup": {
            "$$.NewFile": { order: 100 },
            "$$.OpenFile": { order: 110 },
            "$$.SaveFile": { order: 120 },
            "$$.SaveFileAs": { order: 130 },
            "$$.SaveAllFiles": { order: 140 },
            "$$.CloseFile": { order: 150 },
            "$$.CloseAllFiles": { order: 160 },
            "$$.RecentFiles" : { order: 170 },
        },

        // NOTE: Battle & Rebel have their own product specific layout group (but should really use this)
        "$$.LayoutGroup": {
            "$$.SaveWindowLayout": { order: 100 },
            "$$.ApplyWindowLayout": { order: 101 },
            "$$.ManageWindowLayouts": { order: 102 },
            "$$.RestoreDefaultLayout": { order: 103 },
            "$$.ChooseWindow": { order: 104 },
        },

        "$$.WelcomeGroup": {
            "$$.ShowWelcomePage": { order: 100 },
        },

        "$$.ExitGroup": {
            "$$.ExitCommand": { order: 100 }
        },
        "$$.SettingsGroup": {
            "$$.SettingsCommand": { order: 100 },
        },
        "$$.FileCloseGroup": {
            "$$.CloseDocumentCommand": { order: 100 }
        },
        "$$.ConnectionGroup": {
            "$$.ConnectCommand": { order: 100 },
            "$$.DisconnectCommand": { order: 110 },
        },
        "$$.LogViewGroup": {
            "$$.ShowLogsCommand": { order: 100 },
            "$$.ShowDocumentWell": { order: 110 },
        },
        "$$.LogClearGroup": {
            "$$.ExportLogsCommand": { order: 100 },
            "$$.ClearLogsCommand": { order: 110 },
        },
        "$$.LogFilterGroup": {
            "$$.ShowInfoLogLevelCommand": { order: 100 },
            "$$.ShowWarningLogLevelCommand": { order: 110 },
            "$$.ShowErrorLogLevelCommand": { order: 120 },
            "$$.ShowFatalLogLevelCommand": { order: 130 },
        },
        "$$.LogSourceFilterGroup": {
            "$$.FilterLogSourceCommand": { order: 100 }
        },
        "$$.DocumentationGroup": {
            "$$.DocumentationCommand": { order: 100 },
            "$$.SamplesCommand": { order: 110 },
            "$$.CheckForUpdatesCommand": { order: 200 },
        },
        "$$.FeedbackGroup": {
            "$$.FeedbackCommand": { order: 100 },
        },
        "$$.AboutGroup": {
            "$$.AboutCommand": { order: 100 },
        },
        "$$.ProjectExplorerViewGroup": {
            "$$.ShowProjectExplorerCommand": { order: 100 }
        },
        "$$.ResetAppDataGroup": {
            "$$.ResetAppDataCommand": { order: 100},
        },
    },

    commandBars: {
        "$$.FileMenu": {
            type: "menu",
            text: qsTr("&File"),
            commandGroups: {
                "$$.ExitGroup": { order: 100 },
            },
        },
        "$$.ConnectionMenu": {
            type: "menu",
            text: qsTr("&Connection"),
            commandGroups: {
                "$$.ConnectionGroup": { order: 100 },
            },
        },
        "$$.ToolsMenu": {
            type: "menu",
            text: qsTr("&Tools"),
            commandGroups: {
                "$$.LogViewGroup": { order: 100 },
                "$$.ProjectExplorerViewGroup": { order: 110 },
                "$$.SettingsGroup": { order: 120 },
            },
        },

        // NOTE: Battle & Rebel have their own product specific window menu (but should really use this)
        "$$.WindowMenu": {
            type: "menu",
            text: qsTr("&Window"),
            commandGroups: {
                "$$.LayoutGroup": { order: 100 },
                "$$.WelcomeGroup": { order: 110 },
            },
        },

        "$$.HelpMenu": {
            type: "menu",
            text: qsTr("&Help"),
            commandGroups: {
                "$$.DocumentationGroup": { order: 100 },
                "$$.ResetAppDataGroup" : { order: 110 },
                "$$.FeedbackGroup": { order: 120 },
                "$$.AboutGroup": { order: 130 },
            },
        },
        "$$.ConnectionToolbar": {
            type: "toolbar",
            text: qsTr("Connection"),
            commandGroups: {
                "$$.ConnectionGroup": { order: 100 },
            },
        },
        "$$.LogWindowToolbar": {
            type: "toolbar",
            text: qsTr("Main"),
            commandGroups: {
                "$$.LogClearGroup": { order: 100 },
                "$$.LogFilterGroup": { order: 110 },
                "$$.LogSourceFilterGroup" : { order: 120 },
            }
        },
        "$$.FeedbackToolbar": {
            type: "rightJustifedToolbar",
            text: qsTr("Feedback"),
            commandGroups: {
                "$$.FeedbackGroup": { order: 100 },
            },
        },
    },

    settings: {
        "$$.Environment": {
            order: 50,
            text: qsTr("Environment"),
            properties: {
                "$$.ColorTheme": {
                    order: 100,
                    type: "installedThemes",
                    category: qsTr("Visual Experience"),
                    text: qsTr("Color Theme"),
                    detailsText: qsTr("The currently selected application color theme."),
                    changeRequiresAppRestart: true,
                },
                "$$.GeneralFont": {
                    order: 101,
                    type: "font",
                    fontType: "general",
                    category: qsTr("Visual Experience"),
                    text: qsTr("General Font"),
                    detailsText: qsTr("General font used for all non-code UI elements."),
                    changeRequiresAppRestart: true,
                },
                "$$.CodeFont": {
                    order: 102,
                    type: "font",
                    fontType: "code",
                    category: qsTr("Visual Experience"),
                    text: qsTr("Code Font"),
                    detailsText: qsTr("Font used for source code and code-like UI elements."),
                    changeRequiresAppRestart: true,
                },
                "$$.DefaultColorMap": {
                    order: 109,
                    type: "defaultColorMap",
                    defaultValue: "Flammenmeer",
                    category: qsTr("Visual Experience"),
                    text: qsTr("Default Color Scale"),
                    detailsText: qsTr("Default color map used to represent a qualitiative scale of values."),
                },
                "$$.DefaultDocumentsFolder": {
                    requiresFlags: ["CorePlugin.HasProjectService"],
                    order: 110,
                    type: "directoryPath",
                    category: qsTr("Documents Folder"),
                    detailsText: qsTr("The folder where projects and documents will be saved."),
                },
                "$$.StartupBehavior": {
                    requiresFlags: ["CorePlugin.HasProjectService"],
                    order: 120,
                    type: "enum",
                    category: qsTr("Startup Behavior"),
                    text: qsTr("At Startup"),
                    detailsText: qsTr("What to do when the host is launched"),
                    defaultValue: "welcomePage",
                    enumValues: {
                        "welcomePage": {
                            order: 100,
                            text: qsTr("Show Welcome Page"),
                        },
                        "quickLaunch": {
                            order: 200,
                            text: qsTr("Show Quick Launch Dialog"),
                        },
                        "lastProject": {
                            order: 300,
                            text: qsTr("Load Last Project"),
                        },
                        "empty": {
                            order: 400,
                            text: qsTr("Show Empty Environment"),
                        },
                    },
                },
                "$$.ShowVersionUpdateNotifications": {
                    requiresFlags: ["CorePlugin.HasVersionUpdateService"],
                    order: 130,
                    type: "bool",
                    category: qsTr("Updates"),
                    text: qsTr("Show version update notifications"),
                    detailsText: qsTr("Show notifications when a new version of this product is available."),
                    defaultValue: true
                },
            },
        },

        "$$.Privacy": {
            requiresFlags: ["CorePlugin.HasPrivacyDialog"],
            order: 9999,
            text: qsTr("Send Feedback..."),
            properties: {
                "$$.AllowAnalytics": {
                    order: 100,
                    type: "bool",
                    category: qsTr("Help Improve NVIDIA Software"),
                    text: qsTr("Collect Usage and Platform Data"),
                    detailsText: qsTr("NVIDIA software packages collect usage and platform data via Google Analytics. \nThis data is not associated with any account information registered with NVIDIA \nand is used under the legitimate interest standard for the sole purpose of \nimproving NVIDIA software. For inquiries, please contact privacy@nvidia.com."),
                },
            },
        },

    },
});

// Rename some commands for increased Mac integration
if (AppLib.environment.darwin) {
    addPlugin({
        commands: {
            "CorePlugin.ExitCommand": {
                shortcut: codeTr("Ctrl+Q"),
                menuRole: "quit",
            },
            "CorePlugin.SettingsCommand": {
                text: qsTr("Preferences..."),
                shortcut: codeTr("Ctrl+,"),
                menuRole: "preferences",
            },
        },
    });
}

if (AppLib.environment.windows) {
    addPlugin({
        settings: {
            "$$.Environment": {
                properties: {
                    "$$.MixedDPIScalingHandling": {
                        requiresFlags: ["CorePlugin.HasMixedDPIScalingHandling"],
                        order: 105,
                        type: "enum",
                        defaultValue: "auto",
                        category: qsTr("Visual Experience"),
                        text: qsTr("Mixed DPI Scaling"),
                        detailsText: qsTr("Requires app restart. Disable Mixed DPI Scaling if unwanted artifacts are detected when using monitors with different DPIs."),
                        changeRequiresAppRestart: true,
                        enumValues: {
                            "auto": {
                                order: 100,
                                text: qsTr("Auto"),
                            },
                            "integerRoundUp": {
                                order: 200,
                                text: qsTr("Integer (round up)")
                            },
                            "integerRoundDown": {
                                order: 300,
                                text: qsTr("Integer (round down)")
                            },
                            "integerRoundAdjust": {
                                order: 400,
                                text: qsTr("Round and adjust the DPI")
                            },
                            "off": {
                                order: 500,
                                text: qsTr("Off"),
                            },
                        },
                    },
                },
            },
        },
    });
}

if (AppLib.environment.has_enhanced_windowing_experience_option) {
    addPlugin({
        settings: {
            "$$.Environment": {
                properties: {
                    "$$.UseEnhancedWindowingExperience": {
                        order: 106,
                        type: "bool",
                        defaultValue: true,
                        category: qsTr("Visual Experience"),
                        text: qsTr("Use Enhanced Windowing Experience"),
                        detailsText: qsTr("Enable an enhanced windowing experience. Requires app restart."),
                        changeRequiresAppRestart: true,
                    },
                },
            },
        },
    });
}

if (AppLib.environment.has_enhanced_windowing_experience) {
    addPlugin({
        settings: {
            "$$.Environment": {
                properties: {
                    "$$.FloatingWindowsAlwaysOnTop": {
                        order: 107,
                        type: "bool",
                        defaultValue: false,
                        category: qsTr("Windowing"),
                        text: qsTr("Floating Windows Always on Top"),
                        detailsText: qsTr("Configure floating tool windows to always stay on top of the main window. Requires app restart."),
                        changeRequiresAppRestart: true,
                    },

                    // XXX: This needs some style changes to support; the borders are currently drawn 
                    // incorrectly.
                    //
                    // "$$.TabBarPosition": {
                    //     order: 108,
                    //     type: "bool",
                    //     type: "enum",
                    //     category: qsTr("Windowing"),
                    //     text: qsTr("Tab Bar Position"),
                    //     detailsText: qsTr("Set the position of tabs on the tab bar for multi-tabbed tool windows. Requires app restart."),
                    //     defaultValue: "south",
                    //     enumValues: {
                    //         "north": {
                    //             order: 100,
                    //             text: qsTr("North"),
                    //         },
                    //         "south": {
                    //             order: 200,
                    //             text: qsTr("South"),
                    //         },
                    //     },
                    //     changeRequiresAppRestart: true,
                    // },
                },
            },
        },
    });
}
