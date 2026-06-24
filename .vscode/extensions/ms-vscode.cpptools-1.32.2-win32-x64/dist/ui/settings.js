'use strict';
const elementId = {
    configName: "configName",
    configNameInvalid: "configNameInvalid",
    configSelection: "configSelection",
    addConfigDiv: "addConfigDiv",
    addConfigBtn: "addConfigBtn",
    addConfigInputDiv: "addConfigInputDiv",
    addConfigOk: "addConfigOk",
    addConfigCancel: "addConfigCancel",
    addConfigName: "addConfigName",
    compilerPath: "compilerPath",
    compilerPathInvalid: "compilerPathInvalid",
    knownCompilers: "knownCompilers",
    noCompilerPathsDetected: "noCompilerPathsDetected",
    compilerArgs: "compilerArgs",
    intelliSenseMode: "intelliSenseMode",
    intelliSenseModeInvalid: "intelliSenseModeInvalid",
    includePath: "includePath",
    includePathInvalid: "includePathInvalid",
    defines: "defines",
    cStandard: "cStandard",
    cppStandard: "cppStandard",
    windowsSdkVersion: "windowsSdkVersion",
    macFrameworkPath: "macFrameworkPath",
    macFrameworkPathInvalid: "macFrameworkPathInvalid",
    compileCommands: "compileCommands",
    compileCommandsInvalid: "compileCommandsInvalid",
    configurationProvider: "configurationProvider",
    forcedInclude: "forcedInclude",
    forcedIncludeInvalid: "forcedIncludeInvalid",
    mergeConfigurations: "mergeConfigurations",
    dotConfig: "dotConfig",
    dotConfigInvalid: "dotConfigInvalid",
    recursiveIncludesReduce: "recursiveIncludes.reduce",
    recursiveIncludesPriority: "recursiveIncludes.priority",
    recursiveIncludesOrder: "recursiveIncludes.order",
    browsePath: "browsePath",
    browsePathInvalid: "browsePathInvalid",
    limitSymbolsToIncludedHeaders: "limitSymbolsToIncludedHeaders",
    databaseFilename: "databaseFilename",
    databaseFilenameInvalid: "databaseFilenameInvalid",
    showAdvanced: "showAdvanced",
    advancedSection: "advancedSection"
};
class SettingsApp {
    vsCodeApi;
    updating = false;
    constructor() {
        this.vsCodeApi = acquireVsCodeApi();
        window.addEventListener("keydown", this.onTabKeyDown.bind(this));
        window.addEventListener("message", this.onMessageReceived.bind(this));
        this.addEventsToConfigNameChanges();
        this.addEventsToInputValues();
        document.getElementById(elementId.knownCompilers)?.addEventListener("change", this.onKnownCompilerSelect.bind(this));
        const oldState = this.vsCodeApi.getState();
        const advancedShown = oldState && oldState.advancedShown;
        const advancedSection = document.getElementById(elementId.advancedSection);
        if (advancedSection) {
            advancedSection.style.display = advancedShown ? "block" : "none";
        }
        document.getElementById(elementId.showAdvanced)?.classList.toggle(advancedShown ? "collapse" : "expand", true);
        document.getElementById(elementId.showAdvanced)?.addEventListener("click", this.onShowAdvanced.bind(this));
        this.vsCodeApi.postMessage({
            command: "initialized"
        });
    }
    addEventsToInputValues() {
        const elements = document.getElementsByName("inputValue");
        elements.forEach(el => {
            el.addEventListener("change", this.onChanged.bind(this, el.id));
        });
        document.getElementById(elementId.limitSymbolsToIncludedHeaders)?.addEventListener("change", this.onChangedCheckbox.bind(this, elementId.limitSymbolsToIncludedHeaders));
        document.getElementById(elementId.mergeConfigurations)?.addEventListener("change", this.onChangedCheckbox.bind(this, elementId.mergeConfigurations));
    }
    addEventsToConfigNameChanges() {
        document.getElementById(elementId.configName)?.addEventListener("change", this.onConfigNameChanged.bind(this));
        document.getElementById(elementId.configSelection)?.addEventListener("change", this.onConfigSelect.bind(this));
        document.getElementById(elementId.addConfigBtn)?.addEventListener("click", this.onAddConfigBtn.bind(this));
        document.getElementById(elementId.addConfigOk)?.addEventListener("click", this.onAddConfigConfirm.bind(this, true));
        document.getElementById(elementId.addConfigCancel)?.addEventListener("click", this.onAddConfigConfirm.bind(this, false));
    }
    onTabKeyDown(e) {
        if (e.keyCode === 9) {
            document.body.classList.add("tabbing");
            window.removeEventListener("keydown", this.onTabKeyDown);
            window.addEventListener("mousedown", this.onMouseDown.bind(this));
        }
    }
    onMouseDown() {
        document.body.classList.remove("tabbing");
        window.removeEventListener("mousedown", this.onMouseDown);
        window.addEventListener("keydown", this.onTabKeyDown.bind(this));
    }
    onShowAdvanced() {
        const isShown = document.getElementById(elementId.advancedSection).style.display === "block";
        document.getElementById(elementId.advancedSection).style.display = isShown ? "none" : "block";
        this.vsCodeApi.setState({ advancedShown: !isShown });
        const element = document.getElementById(elementId.showAdvanced);
        element.classList.toggle("collapse");
        element.classList.toggle("expand");
    }
    onAddConfigBtn() {
        this.showElement(elementId.addConfigDiv, false);
        this.showElement(elementId.addConfigInputDiv, true);
    }
    onAddConfigConfirm(request) {
        this.showElement(elementId.addConfigInputDiv, false);
        this.showElement(elementId.addConfigDiv, true);
        if (request) {
            const el = document.getElementById(elementId.addConfigName);
            if (el.value !== undefined && el.value !== "") {
                this.vsCodeApi.postMessage({
                    command: "addConfig",
                    name: el.value
                });
                el.value = "";
            }
        }
    }
    onConfigNameChanged() {
        if (this.updating) {
            return;
        }
        const configName = document.getElementById(elementId.configName);
        const list = document.getElementById(elementId.configSelection);
        if (configName.value === "") {
            document.getElementById(elementId.configName).value = list.options[list.selectedIndex].value;
            return;
        }
        list.options[list.selectedIndex].value = configName.value;
        list.options[list.selectedIndex].text = configName.value;
        this.onChanged(elementId.configName);
    }
    onConfigSelect() {
        if (this.updating) {
            return;
        }
        const el = document.getElementById(elementId.configSelection);
        document.getElementById(elementId.configName).value = el.value;
        this.vsCodeApi.postMessage({
            command: "configSelect",
            index: el.selectedIndex
        });
    }
    onKnownCompilerSelect() {
        if (this.updating) {
            return;
        }
        const el = document.getElementById(elementId.knownCompilers);
        document.getElementById(elementId.compilerPath).value = el.value;
        this.onChanged(elementId.compilerPath);
        this.vsCodeApi.postMessage({
            command: "knownCompilerSelect"
        });
    }
    fixKnownCompilerSelection() {
        const compilerPath = document.getElementById(elementId.compilerPath).value.toLowerCase();
        const knownCompilers = document.getElementById(elementId.knownCompilers);
        for (let n = 0; n < knownCompilers.options.length; n++) {
            if (compilerPath === knownCompilers.options[n].value.toLowerCase()) {
                knownCompilers.value = knownCompilers.options[n].value;
                return;
            }
        }
        knownCompilers.value = '';
    }
    onChangedCheckbox(id) {
        if (this.updating) {
            return;
        }
        const el = document.getElementById(id);
        this.vsCodeApi.postMessage({
            command: "change",
            key: id,
            value: el.checked
        });
    }
    onChanged(id) {
        if (this.updating) {
            return;
        }
        const el = document.getElementById(id);
        if (id === elementId.compilerPath) {
            this.fixKnownCompilerSelection();
        }
        this.vsCodeApi.postMessage({
            command: "change",
            key: id,
            value: el.value
        });
    }
    onMessageReceived(e) {
        const message = e.data;
        switch (message.command) {
            case 'updateConfig':
                this.updateConfig(message.config);
                break;
            case 'updateErrors':
                this.updateErrors(message.errors);
                break;
            case 'setKnownCompilers':
                this.setKnownCompilers(message.compilers);
                break;
            case 'updateConfigSelection':
                this.updateConfigSelection(message);
                break;
        }
    }
    updateConfig(config) {
        this.updating = true;
        try {
            const joinEntries = (input) => (input && input.length) ? input.join("\n") : "";
            document.getElementById(elementId.configName).value = config.name;
            document.getElementById(elementId.compilerPath).value = config.compilerPath ?? "";
            this.fixKnownCompilerSelection();
            document.getElementById(elementId.compilerArgs).value = joinEntries(config.compilerArgs);
            document.getElementById(elementId.intelliSenseMode).value = config.intelliSenseMode ?? "${default}";
            document.getElementById(elementId.includePath).value = joinEntries(config.includePath);
            document.getElementById(elementId.defines).value = joinEntries(config.defines);
            document.getElementById(elementId.cStandard).value = config.cStandard;
            document.getElementById(elementId.cppStandard).value = config.cppStandard;
            document.getElementById(elementId.windowsSdkVersion).value = config.windowsSdkVersion ?? "";
            document.getElementById(elementId.macFrameworkPath).value = joinEntries(config.macFrameworkPath);
            document.getElementById(elementId.compileCommands).value = joinEntries(config.compileCommands);
            document.getElementById(elementId.mergeConfigurations).checked = config.mergeConfigurations;
            document.getElementById(elementId.configurationProvider).value = config.configurationProvider ?? "";
            document.getElementById(elementId.forcedInclude).value = joinEntries(config.forcedInclude);
            document.getElementById(elementId.dotConfig).value = config.dotConfig ?? "";
            if (config.recursiveIncludes) {
                document.getElementById(elementId.recursiveIncludesReduce).value = config.recursiveIncludes.reduce ?? "${default}";
                document.getElementById(elementId.recursiveIncludesPriority).value = config.recursiveIncludes.priority ?? "${default}";
                document.getElementById(elementId.recursiveIncludesOrder).value = config.recursiveIncludes.order ?? "${default}";
            }
            if (config.browse) {
                document.getElementById(elementId.browsePath).value = joinEntries(config.browse.path);
                document.getElementById(elementId.limitSymbolsToIncludedHeaders).checked =
                    config.browse.limitSymbolsToIncludedHeaders && config.browse.limitSymbolsToIncludedHeaders;
                document.getElementById(elementId.databaseFilename).value = config.browse.databaseFilename ?? "";
            }
            else {
                document.getElementById(elementId.browsePath).value = "";
                document.getElementById(elementId.limitSymbolsToIncludedHeaders).checked = false;
                document.getElementById(elementId.databaseFilename).value = "";
            }
        }
        finally {
            this.updating = false;
        }
    }
    updateErrors(errors) {
        this.updating = true;
        try {
            this.showErrorWithInfo(elementId.configNameInvalid, errors.name);
            this.showErrorWithInfo(elementId.intelliSenseModeInvalid, errors.intelliSenseMode);
            this.showErrorWithInfo(elementId.compilerPathInvalid, errors.compilerPath);
            this.showErrorWithInfo(elementId.includePathInvalid, errors.includePath);
            this.showErrorWithInfo(elementId.macFrameworkPathInvalid, errors.macFrameworkPath);
            this.showErrorWithInfo(elementId.forcedIncludeInvalid, errors.forcedInclude);
            this.showErrorWithInfo(elementId.compileCommandsInvalid, errors.compileCommands);
            this.showErrorWithInfo(elementId.browsePathInvalid, errors.browsePath);
            this.showErrorWithInfo(elementId.databaseFilenameInvalid, errors.databaseFilename);
            this.showErrorWithInfo(elementId.dotConfigInvalid, errors.dotConfig);
        }
        finally {
            this.updating = false;
        }
    }
    showErrorWithInfo(elementID, errorInfo) {
        this.showElement(elementID, errorInfo ? true : false);
        document.getElementById(elementID).textContent = errorInfo ? errorInfo : "";
    }
    updateConfigSelection(message) {
        this.updating = true;
        try {
            const list = document.getElementById(elementId.configSelection);
            list.options.length = 0;
            for (const name of message.selections) {
                const option = document.createElement("option");
                option.text = name;
                option.value = name;
                list.append(option);
            }
            list.selectedIndex = message.selectedIndex;
        }
        finally {
            this.updating = false;
        }
    }
    setKnownCompilers(compilers) {
        this.updating = true;
        try {
            const list = document.getElementById(elementId.knownCompilers);
            if (list.firstChild) {
                return;
            }
            if (compilers.length === 0) {
                const noCompilerSpan = document.getElementById(elementId.noCompilerPathsDetected);
                const option = document.createElement("option");
                option.text = noCompilerSpan.textContent ?? "";
                option.disabled = true;
                list.append(option);
            }
            else {
                for (const path of compilers) {
                    const option = document.createElement("option");
                    option.text = path;
                    option.value = path;
                    list.append(option);
                }
            }
            this.showElement(elementId.compilerPath, true);
            this.showElement(elementId.knownCompilers, true);
            list.value = "";
        }
        finally {
            this.updating = false;
        }
    }
    showElement(elementID, show) {
        document.getElementById(elementID).style.display = show ? "block" : "none";
    }
}
const app = new SettingsApp();
//# sourceMappingURL=settings.js.map
// SIG // Begin signature block
// SIG // MIInRwYJKoZIhvcNAQcCoIInODCCJzQCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // o347hXdmXem8BAMqmSQcDX9APRP4q6HNIq1daBO7A2Og
// SIG // ggy6MIIF9TCCA92gAwIBAgITMwAAAh1NGchO1w9XSAAA
// SIG // AAACHTANBgkqhkiG9w0BAQsFADBXMQswCQYDVQQGEwJV
// SIG // UzEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDI0MB4XDTI2MDQxNjE4NTk0M1oXDTI3MDQx
// SIG // NTE4NTk0M1owdDELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEeMBwG
// SIG // A1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMIIBIjAN
// SIG // BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0L3sF8cf
// SIG // YGWRQumLNVgWsvASfJBgOCUJx+QjGn6jgEpU6SvR/KOW
// SIG // V017dHGlUEzTFD7eOOcF2A/nRbWilk8A59SOdqFEqwvb
// SIG // yYp9RrKrfs8iiS+Q4N3kF20DUetQ5jMttBi0yDt0hXnf
// SIG // UX4v6KYYAixhSw0d69Crx48DG/42FktHHpVf+C89uy3w
// SIG // HpJvL/ROSF2nol2wFGGSitPdJ+AlZdyQbWzfvQ7SPUjb
// SIG // v8o76M1udv7u0V/07aWvyg5abqJGfmXG75rXfbq/YBS7
// SIG // 2c4eNaPTLBP3JULXWhVhr7qOibmv57aYJHstxOf7wRXv
// SIG // jCTxuqYXZ7qOq+e2bnQrnYiNWwIDAQABo4IBmzCCAZcw
// SIG // DgYDVR0PAQH/BAQDAgeAMB8GA1UdJQQYMBYGCisGAQQB
// SIG // gjdMCAEGCCsGAQUFBwMDMB0GA1UdDgQWBBR+kLjMKnDx
// SIG // tIUJUOnOYwrU0y61XjBFBgNVHREEPjA8pDowODEeMBwG
// SIG // A1UECxMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMRYwFAYD
// SIG // VQQFEw0yMzAwMTIrNTA3NTU5MB8GA1UdIwQYMBaAFH9Z
// SIG // P1Qh2q1P7wXl5qPXLQaUEggxMGAGA1UdHwRZMFcwVaBT
// SIG // oFGGT2h0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lv
// SIG // cHMvY3JsL01pY3Jvc29mdCUyMENvZGUlMjBTaWduaW5n
// SIG // JTIwUENBJTIwMjAyNC5jcmwwbQYIKwYBBQUHAQEEYTBf
// SIG // MF0GCCsGAQUFBzAChlFodHRwOi8vd3d3Lm1pY3Jvc29m
// SIG // dC5jb20vcGtpb3BzL2NlcnRzL01pY3Jvc29mdCUyMENv
// SIG // ZGUlMjBTaWduaW5nJTIwUENBJTIwMjAyNC5jcnQwDAYD
// SIG // VR0TAQH/BAIwADANBgkqhkiG9w0BAQsFAAOCAgEASk22
// SIG // Do88Exvw1xms/bOvn0Hmk7Q3BZjGPuVMlRQso+z7/uYt
// SIG // +6n1/JUi/7QSH2EH1rDLgUJX2bqyQ+q+B1Sdgnh/tX4I
// SIG // qvHXB3VSqGd0mtql6F93KvYkvHFW9Oge/uf1yeyNDsRx
// SIG // /Xw7Lyd098OVf2bQCBZi65fj9ArRvvdrs0bJ9J023RYz
// SIG // pCzC1jywFN0x6ISkZUhDIBSaT5JuZ+VAGd+cV+hVgqwy
// SIG // 7Eim+eeW04n8GvJiQcHZaH9G5n2InR/ncWdRXQ8by5zZ
// SIG // fc3irAOJHo2miKqiD4LocALYuUJewZUzaCTcMQrwZqlt
// SIG // jEC5wpGDf1VVLEd1dsf63Ezc6AX/2f0qUTr3WgNmTjnd
// SIG // boqFybd7XS0O7x6aqYm9Cn1q/xVl1tdKt/FcXwp0UAas
// SIG // 20rs7Ue5xDLs1+wpPgf12jw13daoe9vkGMgdGdlc1pjv
// SIG // c7J2/VKv3cLvCxnkKp8ruu0gxgAr514otn2/flEuPdlU
// SIG // 510pxSsqsIM1MhTLWStf7B2E7+mxuE7UFMoEMUzfmVfm
// SIG // iSJSjtjKme2yqwJzs0vZujYKE3VjqtdW0zmcCpSBFfxI
// SIG // VfUlpA5naUf4Tz09r+kxI+BfD0/8x40XsyFOXPwxpbf1
// SIG // YWP6StF5CbRMjJpktQTLY1P66gWVTCJt3Z8ULP0wQcq/
// SIG // gn/Gda+2on0FUPlkqs4wgga9MIIEpaADAgECAhMzAAAA
// SIG // OTu2Nxm/Bh1nAAAAAAA5MA0GCSqGSIb3DQEBDAUAMIGI
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYDVQQDEylNaWNy
// SIG // b3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkg
// SIG // MjAxMTAeFw0yNDA4MDgyMDU0MThaFw0zNjAzMjIyMjEz
// SIG // MDRaMFcxCzAJBgNVBAYTAlVTMR4wHAYDVQQKExVNaWNy
// SIG // b3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01pY3Jv
// SIG // c29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMjQwggIiMA0G
// SIG // CSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDYAZwe4zjH
// SIG // qpUWBzWtuub+CGPXx/EyoXph3zyDXtYKS2ld3YYN9uFs
// SIG // B9Oi3B26Z7AbpAgzYra8qNHbUvxFuiP8hC/2y0mPISqW
// SIG // 30LlrrAT6/ams2HA8Qlv6p42+SbCNbPGzToN21QE70FS
// SIG // +LXH9N2k8nLM/EHgnTNJf8h0TmyfUKmszNa+lTxDieyy
// SIG // /rhBG+98OkArobPPWtbr9c3qzmDJ7J3kUcAm6cltdSHI
// SIG // IFNHESgw6taY1ScyGyBevqIl120XjrIHiPM7tRckHytH
// SIG // 1ZGsmvEplR0P7Tn9t5meFvZNEYttkFvad1IEguTlA5LS
// SIG // scXAphi+rVy3zhklhyCFeGK0yU0+jzbcuURKIxybmRwK
// SIG // 5BfVZx0xEVqE4wM3yN5D/uW+GpVHYYAGe7bTrtW1Z13x
// SIG // 2qj2Jdqz7NtI4tNyzlVrIf62nYBNe3rOYS/repVdHlR6
// SIG // 1YbLLETlibs9jFzAre4sO5RTxvS1yho7JqJ59oKLRnRy
// SIG // LhIOSZyTCVZosXeS0ZZJoGEWSs4cUgsMqBiKtD4WgO2P
// SIG // lT3LeaQh5Io3CCA5tJ5ZCvtCsnqaJXKhptE/xmEETIRy
// SIG // ZRjjplUKKd+sFFVGJJVMvvrw1nhIBKOLO4cTepiG39jE
// SIG // iEP4iHzGYCcQuvaLpDFFwqzgt0pBP8SJIKX5dtjDNYrZ
// SIG // Gd+ZzV5DKJVNZQIDAQABo4IBTjCCAUowDgYDVR0PAQH/
// SIG // BAQDAgGGMBAGCSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQW
// SIG // BBR/WT9UIdqtT+8F5eaj1y0GlBIIMTAZBgkrBgEEAYI3
// SIG // FAIEDB4KAFMAdQBiAEMAQTAPBgNVHRMBAf8EBTADAQH/
// SIG // MB8GA1UdIwQYMBaAFHItOgIxkEO5FAVO4eqnxzHRI4k0
// SIG // MFoGA1UdHwRTMFEwT6BNoEuGSWh0dHA6Ly9jcmwubWlj
// SIG // cm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1Jv
// SIG // b0NlckF1dDIwMTFfMjAxMV8wM18yMi5jcmwwXgYIKwYB
// SIG // BQUHAQEEUjBQME4GCCsGAQUFBzAChkJodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1Jvb0Nl
// SIG // ckF1dDIwMTFfMjAxMV8wM18yMi5jcnQwDQYJKoZIhvcN
// SIG // AQEMBQADggIBABSUHzgoT+6J5+nyyDCq0pTdVmCsAxYA
// SIG // HXcpjlDtxazPHewf1v4kOg8V7A5+w+VuMDMGHi8rLXBK
// SIG // n5I8+DVEUYGs8jLuckc0IeC6owOLUrU3CYdaKRMaO55+
// SIG // T7jwWJ27tPkx0rlR03tFU0z1YYpcv6Yhaw6N2sUPT+Av
// SIG // jpecnrftoE33pCAkucUvnGH0iL4J9CZLFQVTGFSOUBbv
// SIG // 6oZy4bBBRFMxvH779IY4JDvpZKVfbcuhpDeL3Z3e8muk
// SIG // Omkfct+GojNapsWsQYujlJ8jZen5Lrp/3YkxZ2Ay06aT
// SIG // pK/5oOVknwog1TDQsbY+MDyguTph5tQ0CLfzDaJG2x91
// SIG // BrBT9UG87C6HLkqiwrx9PSKN3wz05rHEfWO+RuKl+0U1
// SIG // /AHQT6NCOjhKI39/c7hWbdKjh5uuWFkBOvXGTNrnhNTA
// SIG // dOXTTYByvYExO8yryv34PAdqo1vPDE/1heVebr2Rramv
// SIG // RUi9kWswKwPqwz7n+iRmM+B6YDGRweEurM1kimAb9FYr
// SIG // As38YHlPnarl1vW3dGrmJTgefAz3DmCnXN0nveIPsS+K
// SIG // XBIWweeCToAJMGE7v/XS3h9qQ6niWQAAVQ1kUAml3zuS
// SIG // 4MisCgi2F6YoK2WAo1EgXK/lXvDxVjIVU0JdL+KvCfwF
// SIG // JkDeVuJ9dNXGNi+AOxk0BtYd9hxwL30BElj9MYIZ5TCC
// SIG // GeECAQEwbjBXMQswCQYDVQQGEwJVUzEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQDEx9N
// SIG // aWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQSAyMDI0AhMz
// SIG // AAACHU0ZyE7XD1dIAAAAAAIdMA0GCWCGSAFlAwQCAQUA
// SIG // oIGuMBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEEMBwG
// SIG // CisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqG
// SIG // SIb3DQEJBDEiBCAeeAW2rOiuYS3Lc2Groax1famxG87x
// SIG // OdkG+aFMy83sFTBCBgorBgEEAYI3AgEMMTQwMqAUgBIA
// SIG // TQBpAGMAcgBvAHMAbwBmAHShGoAYaHR0cDovL3d3dy5t
// SIG // aWNyb3NvZnQuY29tMA0GCSqGSIb3DQEBAQUABIIBAFcC
// SIG // BZ3bV+WX3zQv5Pw5WCj4iLL7Lm+gO/Harkco2niE4lQE
// SIG // +nu/ErTOE9RU0rEYV+SMjIVLxvqy2k8CjwpmvEmjuuN9
// SIG // pdHH8+Jw/fE5hJMNzq3AAppSsMoKsETlHW3DSjKg3F6o
// SIG // Y4TkKdNDRv8RK5z4T4hnD4IMqvOXHGPKY5bJNfeNLteQ
// SIG // woVoXR0RjKtNzC2aYJjOeqaKgDaTLZg8mjQkd9CXPKpR
// SIG // ZNkebljhqFaya16pFW4sXRGgIMaU8mjyXwuGSnLgaT/3
// SIG // TJ1vTV2Zuwv4aWx8G9uXSy2gJedYmTUkisMztldOTXWk
// SIG // eSFEf5e59sVpzF/8gKjo78NmJoPY0I6hgheXMIIXkwYK
// SIG // KwYBBAGCNwMDATGCF4Mwghd/BgkqhkiG9w0BBwKgghdw
// SIG // MIIXbAIBAzEPMA0GCWCGSAFlAwQCAQUAMIIBUgYLKoZI
// SIG // hvcNAQkQAQSgggFBBIIBPTCCATkCAQEGCisGAQQBhFkK
// SIG // AwEwMTANBglghkgBZQMEAgEFAAQgHlVyQdhJ9M/ue+bb
// SIG // fcazb0M6sFryC2LhzD88PI4SysUCBmnnjF9JiBgTMjAy
// SIG // NjA0MjgyMjE0MTYuNzM0WjAEgAIB9KCB0aSBzjCByzEL
// SIG // MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
// SIG // EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
// SIG // c29mdCBDb3Jwb3JhdGlvbjElMCMGA1UECxMcTWljcm9z
// SIG // b2Z0IEFtZXJpY2EgT3BlcmF0aW9uczEnMCUGA1UECxMe
// SIG // blNoaWVsZCBUU1MgRVNOOkRDMDAtMDVFMC1EOTQ3MSUw
// SIG // IwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2
// SIG // aWNloIIR7TCCByAwggUIoAMCAQICEzMAAAIkO4QhsCys
// SIG // ZCIAAQAAAiQwDQYJKoZIhvcNAQELBQAwfDELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgUENBIDIwMTAwHhcNMjYwMjE5MTkzOTU5
// SIG // WhcNMjcwNTE3MTkzOTU5WjCByzELMAkGA1UEBhMCVVMx
// SIG // EzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1Jl
// SIG // ZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3Jh
// SIG // dGlvbjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJpY2Eg
// SIG // T3BlcmF0aW9uczEnMCUGA1UECxMeblNoaWVsZCBUU1Mg
// SIG // RVNOOkRDMDAtMDVFMC1EOTQ3MSUwIwYDVQQDExxNaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIICIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAo+lt1GkNma+I
// SIG // Tb0su4+1DDxVcrO2hMRgfiRcMpM814N42smJvYDi1ye7
// SIG // TYVNnpoay0AjmXIC78+hZKpoIc0Mc5pICrS2IimhM4aI
// SIG // Dv3HtJU4XSzXVbTMEDmIKPl7VwGXFYgV+C3B5N/EbrGY
// SIG // he8MUmubfy8YnNOPmf4ZctYCUKSHhQ6qeGvT7i7fK7Hx
// SIG // 9Ob1vaVPbq4hnQ8XyV5/5XOPQsW16gNxF9ey9uG3Orfp
// SIG // hbjwwCSiqWot116hdpyZaUz33awNvbFk0jSooPQrQQub
// SIG // c0I9H5W7Gv+MKjvbvkZLsKWW92+6p1uRXRaw0db0Jl34
// SIG // 5clD/WTt/PN/TcEroh7b7BQjZEzSF/Di+V1atZ7Csrv/
// SIG // xniGfWLsbHywXnahtNuDwxEcqwLNKb31Fji2qVUGoxz6
// SIG // Ap7jUir2xIe7OSENGILqRo4vh+6yA8dv5iBCPukPFsAb
// SIG // ZN2McoY49Bl8PdPYtBJE5FcsvtcgA48EgvG8NqjOPjHO
// SIG // IcsrZWc0nNCD1AatWBp2MAoyMGuf5TFtKRZ/x6SXQel3
// SIG // jLk7WEzqWj6KOuBY0K8i11o3eKL6cOZTsO1/r9xPZMDf
// SIG // VQQvsCREgRAgtYGTAkuU2lcHxNcOKZ1129ak/W44EbD4
// SIG // OHZJa7lE3aJ/90jbdGtEOTXNlJfqzJUMV6D/YrF8DDZy
// SIG // juSSZKkQ0VUCAwEAAaOCAUkwggFFMB0GA1UdDgQWBBRz
// SIG // H5F9bv8ySwjHtIKmIrcdbQB3qDAfBgNVHSMEGDAWgBSf
// SIG // pxVdAF5iXYP05dJlpxtTNRnpcjBfBgNVHR8EWDBWMFSg
// SIG // UqBQhk5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtp
// SIG // b3BzL2NybC9NaWNyb3NvZnQlMjBUaW1lLVN0YW1wJTIw
// SIG // UENBJTIwMjAxMCgxKS5jcmwwbAYIKwYBBQUHAQEEYDBe
// SIG // MFwGCCsGAQUFBzAChlBodHRwOi8vd3d3Lm1pY3Jvc29m
// SIG // dC5jb20vcGtpb3BzL2NlcnRzL01pY3Jvc29mdCUyMFRp
// SIG // bWUtU3RhbXAlMjBQQ0ElMjAyMDEwKDEpLmNydDAMBgNV
// SIG // HRMBAf8EAjAAMBYGA1UdJQEB/wQMMAoGCCsGAQUFBwMI
// SIG // MA4GA1UdDwEB/wQEAwIHgDANBgkqhkiG9w0BAQsFAAOC
// SIG // AgEAPsB0m5oSKTPAkVWeLZOtuIUPi3WVxOKqHkLou+wn
// SIG // jWt46tRTs4uzESpJKOnYhAx1zzVrwGoMWrLQnsD85uUw
// SIG // jYdbOKgh4eEdhv6+PMFPzKXOvP1g5icuQiEJ/xcKbNbG
// SIG // zVBLuwc4NNOKlCyFSfet46P2puMcCoMIfr0lS+/3YbH0
// SIG // +3b4aUXXW2C0Ex2YMLjQekIXBBLIKIC1cDUY9+1RFmQ4
// SIG // sKDHccgu2GK0LujAlbYsx5zrZEl+xaiKIuo5XH6n6Otf
// SIG // bgx/a/JNqgDhwnhAKilyspiFwzHBhpRHQxW2Ig2YDwgT
// SIG // NCB4AHopVEqJ9O8Ix7tHtLLAZrQWnz2+BnfuRbkZ1ht1
// SIG // xnvdTQqSyqphWv+BpFc/TjM2VIPKHM8Qv+CU9x3+OSRL
// SIG // bM06F8DbJFdyTQnLtiCLa+kiR5otxA1QAw0UjYXcxUaW
// SIG // JqZRhJT5eRkaD7SYgxL0SG7+TBSiMNsfYJ3oX+SLwYwu
// SIG // GZAYPuBk6ahhN5pp8xd5yHpDpF+LoNP9Jjdgkmq4bkov
// SIG // TZhyDqVDdnkB1LYE2//hpqu4JLQjMCKvyTgmCIk2Kqb9
// SIG // aG4wBinVjDwq5UsjQLNI2WM5IWud+defDTMfsARr7Hxa
// SIG // FbAjBuTnKer1ugl8rlkW1FajFNTq0Gx33csyaW4SQtT2
// SIG // wGSMiQmzflQYA0wM0ymPMOCEksEwggdxMIIFWaADAgEC
// SIG // AhMzAAAAFcXna54Cm0mZAAAAAAAVMA0GCSqGSIb3DQEB
// SIG // CwUAMIGIMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYDVQQD
// SIG // EylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRo
// SIG // b3JpdHkgMjAxMDAeFw0yMTA5MzAxODIyMjVaFw0zMDA5
// SIG // MzAxODMyMjVaMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAk
// SIG // BgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAy
// SIG // MDEwMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKC
// SIG // AgEA5OGmTOe0ciELeaLL1yR5vQ7VgtP97pwHB9KpbE51
// SIG // yMo1V/YBf2xK4OK9uT4XYDP/XE/HZveVU3Fa4n5KWv64
// SIG // NmeFRiMMtY0Tz3cywBAY6GB9alKDRLemjkZrBxTzxXb1
// SIG // hlDcwUTIcVxRMTegCjhuje3XD9gmU3w5YQJ6xKr9cmmv
// SIG // Haus9ja+NSZk2pg7uhp7M62AW36MEBydUv626GIl3GoP
// SIG // z130/o5Tz9bshVZN7928jaTjkY+yOSxRnOlwaQ3KNi1w
// SIG // jjHINSi947SHJMPgyY9+tVSP3PoFVZhtaDuaRr3tpK56
// SIG // KTesy+uDRedGbsoy1cCGMFxPLOJiss254o2I5JasAUq7
// SIG // vnGpF1tnYN74kpEeHT39IM9zfUGaRnXNxF803RKJ1v2l
// SIG // IH1+/NmeRd+2ci/bfV+AutuqfjbsNkz2K26oElHovwUD
// SIG // o9Fzpk03dJQcNIIP8BDyt0cY7afomXw/TNuvXsLz1dhz
// SIG // PUNOwTM5TI4CvEJoLhDqhFFG4tG9ahhaYQFzymeiXtco
// SIG // dgLiMxhy16cg8ML6EgrXY28MyTZki1ugpoMhXV8wdJGU
// SIG // lNi5UPkLiWHzNgY1GIRH29wb0f2y1BzFa/ZcUlFdEtsl
// SIG // uq9QBXpsxREdcu+N+VLEhReTwDwV2xo3xwgVGD94q0W2
// SIG // 9R6HXtqPnhZyacaue7e3PmriLq0CAwEAAaOCAd0wggHZ
// SIG // MBIGCSsGAQQBgjcVAQQFAgMBAAEwIwYJKwYBBAGCNxUC
// SIG // BBYEFCqnUv5kxJq+gpE8RjUpzxD/LwTuMB0GA1UdDgQW
// SIG // BBSfpxVdAF5iXYP05dJlpxtTNRnpcjBcBgNVHSAEVTBT
// SIG // MFEGDCsGAQQBgjdMg30BATBBMD8GCCsGAQUFBwIBFjNo
// SIG // dHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL0Rv
// SIG // Y3MvUmVwb3NpdG9yeS5odG0wEwYDVR0lBAwwCgYIKwYB
// SIG // BQUHAwgwGQYJKwYBBAGCNxQCBAweCgBTAHUAYgBDAEEw
// SIG // CwYDVR0PBAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8wHwYD
// SIG // VR0jBBgwFoAU1fZWy4/oolxiaNE9lJBb186aGMQwVgYD
// SIG // VR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3Nv
// SIG // ZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWljUm9vQ2Vy
// SIG // QXV0XzIwMTAtMDYtMjMuY3JsMFoGCCsGAQUFBwEBBE4w
// SIG // TDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3Nv
// SIG // ZnQuY29tL3BraS9jZXJ0cy9NaWNSb29DZXJBdXRfMjAx
// SIG // MC0wNi0yMy5jcnQwDQYJKoZIhvcNAQELBQADggIBAJ1V
// SIG // ffwqreEsH2cBMSRb4Z5yS/ypb+pcFLY+TkdkeLEGk5c9
// SIG // MTO1OdfCcTY/2mRsfNB1OW27DzHkwo/7bNGhlBgi7ulm
// SIG // ZzpTTd2YurYeeNg2LpypglYAA7AFvonoaeC6Ce5732pv
// SIG // vinLbtg/SHUB2RjebYIM9W0jVOR4U3UkV7ndn/OOPcbz
// SIG // aN9l9qRWqveVtihVJ9AkvUCgvxm2EhIRXT0n4ECWOKz3
// SIG // +SmJw7wXsFSFQrP8DJ6LGYnn8AtqgcKBGUIZUnWKNsId
// SIG // w2FzLixre24/LAl4FOmRsqlb30mjdAy87JGA0j3mSj5m
// SIG // O0+7hvoyGtmW9I/2kQH2zsZ0/fZMcm8Qq3UwxTSwethQ
// SIG // /gpY3UA8x1RtnWN0SCyxTkctwRQEcb9k+SS+c23Kjgm9
// SIG // swFXSVRk2XPXfx5bRAGOWhmRaw2fpCjcZxkoJLo4S5pu
// SIG // +yFUa2pFEUep8beuyOiJXk+d0tBMdrVXVAmxaQFEfnyh
// SIG // YWxz/gq77EFmPWn9y8FBSX5+k77L+DvktxW/tM4+pTFR
// SIG // hLy/AsGConsXHRWJjXD+57XQKBqJC4822rpM+Zv/Cuk0
// SIG // +CQ1ZyvgDbjmjJnW4SLq8CdCPSWU5nR0W2rRnj7tfqAx
// SIG // M328y+l7vzhwRNGQ8cirOoo6CGJ/2XBjU02N7oJtpQUQ
// SIG // wXEGahC0HVUzWLOhcGbyoYIDUDCCAjgCAQEwgfmhgdGk
// SIG // gc4wgcsxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJTAjBgNVBAsT
// SIG // HE1pY3Jvc29mdCBBbWVyaWNhIE9wZXJhdGlvbnMxJzAl
// SIG // BgNVBAsTHm5TaGllbGQgVFNTIEVTTjpEQzAwLTA1RTAt
// SIG // RDk0NzElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3Rh
// SIG // bXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUApgjx25rH
// SIG // gEn3v/2xrV/XkBvtPuOggYMwgYCkfjB8MQswCQYDVQQG
// SIG // EwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
// SIG // BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
// SIG // cnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGlt
// SIG // ZS1TdGFtcCBQQ0EgMjAxMDANBgkqhkiG9w0BAQsFAAIF
// SIG // AO2bRDwwIhgPMjAyNjA0MjgxNDM1NDBaGA8yMDI2MDQy
// SIG // OTE0MzU0MFowdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA
// SIG // 7ZtEPAIBADAKAgEAAgIGAQIB/zAHAgEAAgISJzAKAgUA
// SIG // 7ZyVvAIBADA2BgorBgEEAYRZCgQCMSgwJjAMBgorBgEE
// SIG // AYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYagMA0G
// SIG // CSqGSIb3DQEBCwUAA4IBAQBfTPXFP55fLmR1rFSweadd
// SIG // HImPtlemFp8ZaUxsxuIhzNckGnX2TsIou9Gag9Rgb6P6
// SIG // dX20eq4Kp/Ubzx7ZXrPg2eluyS9zcARDSLaFFo6qLJ6g
// SIG // 5zAfIRvqNTjR2j7F1SslT8ZZA1Zh3Tz46fogbFUjWpoP
// SIG // ibLjK2bDDrSHbXLKZkKCYIJEN3FE+hTb66iildYLiL3Q
// SIG // 0BwL7wsee6kAz5OuuRBwtrjHXfC9qNMbr2WXUMfaKV4v
// SIG // K2IJewZ+27Z0eszcw/FYyJAt06tuavbJtvdYc72vgj0G
// SIG // SBEu2b568NC5rn9/w0s34iFO6/J/8zE8H5m8RhFQXWjW
// SIG // LvJRJ9V+rteJMYIEDTCCBAkCAQEwgZMwfDELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgUENBIDIwMTACEzMAAAIkO4QhsCysZCIA
// SIG // AQAAAiQwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3
// SIG // DQEJAzENBgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQx
// SIG // IgQggjpO9ZVKoacUa6ODPd6YHAV0cC2XPsgRvEQAhLpT
// SIG // RKYwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCBI
// SIG // IT03apv3UcmdAXM13HZaFRKiAnXJqVTWx/QhFc1kjjCB
// SIG // mDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNV
// SIG // BAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEw
// SIG // AhMzAAACJDuEIbAsrGQiAAEAAAIkMCIEIHcfQ66PU23+
// SIG // ZkV+20eNPDz9CXmGZ5bTnQET/uFojpHUMA0GCSqGSIb3
// SIG // DQEBCwUABIICABxYdhrOL5gQDloQSsKsNkhwSJiTy3pp
// SIG // j3DxjD2icsDDqwIa6jeucbNhdKUfkxhtpCwXUw9SOdtO
// SIG // TUREIGyZh0dJFsvMvayB8zN3BnG2MPM99HGcqSumEdc/
// SIG // VbsUJDvLdvTGZLhScypVJ0CUW5uVxCJKLA8QfIl2hORl
// SIG // k6SRRzwqXciGL7IkjU/VmF3J6aqbwAUG4z8rfGgtssWD
// SIG // bVyxdk9k2IUhhC70mkr1KVtxpOWZhi7tHWcDnfjrv2wG
// SIG // UZIiDOPmIzW2YInu+I8xSQtfLQ94GID5enO2Ej7b+Fu1
// SIG // 1/YO/Tl5G6HSeohFVr850dJTtzAnSIFI209A2vt0c0Wj
// SIG // 6WnT7WG3x6sNBgK5UT7DteKReG3yeKB20NeQkVSAcjy9
// SIG // RlbqwufnGoat+wh5oPQoVuTw07lixc6jX/mZ29//CZjP
// SIG // XCh1P3IcSemeFZodNr/ESh+A0LZj62koXRyXOzy9Se7p
// SIG // gszMb71Bc3RJOzQ7DDrPbIq/BdSNpavN7+tUwqe8sy8G
// SIG // CqSHxbENk9Jw0tvDKr3oRSMcVI99QLR6wLPsH7myXJHL
// SIG // tmdxmfpoFb6W4aDKTbeqbsvzFxjBUpgHkZcWJ3sMlebo
// SIG // sNp6WIKGRaxFMwa/3wfMrE5BGYN4PdVV5ioCdOJluKR1
// SIG // P4RvuablrhO204pPUZ4HSxHvOvIiM94GnmM/
// SIG // End signature block
