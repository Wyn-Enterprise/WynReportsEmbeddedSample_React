export const createDesigner = (portalUrl, referenceToken, onSavedReport) => {
    var baseServerApi = designer.getBaseServerApi(portalUrl, referenceToken);

   // Override route mutations
   baseServerApi.updateRoute = () => {};

    var showElement = function (id) {
        if (!id) return;
        document.getElementById(id).style.display = 'block'
    };

    var hideElement = function (id) {
        if (!id) return;
        document.getElementById(id).style.display = 'none'
    };

    var designerId = 'designer-id';
    var saveAsDialogId = 'save-as-dialog-id';
    var saveDialogId = 'save-dialog-id';
    var dataSetPickerDialogId = 'data-set-picker-dialog-id';

    var showDesigner = function () {
        var info = designer.api.getReportInfo();
        var isDirty = designer.api.isReportDirty();
        document.title = info.name + (isDirty ? ' *' : '');
        showElement(designerId);
        designer.focus();
    };

    function showSaveDialog(options) {
        showElement(saveDialogId);
        options.createSaveReportDialog(saveDialogId, {
            serverApi: {
                saveReportById: baseServerApi.saveExistingReport,
            },
            locale: options.locale,
            reportInfo: {
                id: options.reportInfo.id,
                name: options.reportInfo.name,
                content: options.reportInfo.content,
            },
            onSuccess: function (saveResult) {
                onSavedReport && onSavedReport(saveResult);
                hideElement(saveDialogId);
                showDesigner();
                options.onSuccess(saveResult)
            },
            onClose: function () {
                hideElement(saveDialogId);
                showDesigner();
            },
        });
    }

    function showSaveAsDialog(options) {
        showElement(saveAsDialogId);
        var isTemplateSaved = false;
        options.createSaveReportAsDialog(saveAsDialogId, {
            serverApi: {
                getReportsList: baseServerApi.getReportsList,
                getTagsList: baseServerApi.getTagsList,
                saveReportByName: baseServerApi.saveNewReport,
                saveReportById: baseServerApi.saveExistingReport,
                templates: {
                    saveTemplateByName: function (options) {
                        return baseServerApi.saveNewTemplate(options).then(function (saveResult) {
                            isTemplateSaved = true;
                            return saveResult;
                        });
                    },
                    getTemplatesList: baseServerApi.getTemplatesList,
                    saveTemplateById: function (options) {
                        return baseServerApi.saveExistingTemplate(options).then(function (saveResult) {
                            isTemplateSaved = true;
                            return saveResult;
                        })
                    },
                },
                tagReport: baseServerApi.setReportTags,
                getRolesList: baseServerApi.getRolesList,
                setReportPermissions: baseServerApi.setReportPermissions,
            },
            externalComponentRender: WynReportCommandsComponent && WynReportCommandsComponent.create(options.reportInfo.id, referenceToken, portalUrl, options.locale),
            locale: options.locale,
            reportInfo: {
                name: options.reportInfo.name,
                content: options.reportInfo.content,
            },
            onSuccess: function (saveResult) {
                onSavedReport && onSavedReport(saveResult);
                hideElement(saveAsDialogId);
                showDesigner();
                options.onSuccess(saveResult);
                if (isTemplateSaved) {
                    baseServerApi.updateTemplateRoute(saveResult);
                    location.reload();
                }
            },
            onClose: function () {
                hideElement(saveAsDialogId);
                showDesigner();
            },
        });
    }

    var designerServerApi = designer.extendOptions(baseServerApi, {
        getDataSetSchema: function (options) {
            var optionsEx = designer.extendOptions(options, {
                getErrorMessage: dataSetPicker.getErrorMessage,
            });
            return baseServerApi.getDataSetSchema(optionsEx);
        },
        // Here you can specify/overwrite certain functions
        // for testing purposes.
    });

    var designerOptions = designer.createDesignerOptions(designerServerApi);
    if (designerOptions.locale === 'en') {
        designerOptions.aboutInfo.applicationTitle = 'WynReports Designer';
        designerOptions.aboutInfo.applicationTitleCompact = 'WynReports Designer';
    }

    designerOptions.customExpressionCommonValues = [
        { value: 'UserContext', key: 'userContext', },
    ];
    designerOptions.customExpressionFunctions = [
        { group: 'conversion', value: 'UserContext.NumberToWords()', key: 'numberToWords' },
        { group: 'miscellaneous', value: 'UserContext.GetValue()', key: 'getValue' },
    ];
    designerOptions.saveButton.visible = true;
    designerOptions.onSave = showSaveDialog;

    designerOptions.saveAsButton.visible = true;
    designerOptions.onSaveAs = showSaveAsDialog;

    designerOptions.dataTab.dataSources.canModify = true;

    var viewer = null;
    designerOptions.openViewer = function (options) {
        if (viewer) {
            viewer.openReport(options.reportInfo.id);
        }
        else {
            viewer = GrapeCity.ActiveReports.JSViewer.create({
                element: '#' + options.element,
                reportID: options.reportInfo.id,
                locale: options.locale,
                reportService: {
                    url: portalUrl,
                    securityToken: referenceToken,
                }
            });
        }
    };

    designerOptions.dataTab.dataSets.canModify = true;
    designerOptions.dataSetPicker.open = function (options) {
        var openInPanel = options.mode === 'Panel';
        if (!openInPanel) showElement(dataSetPickerDialogId);
        dataSetPicker.renderDataSetPicker(openInPanel ? options.elementId : dataSetPickerDialogId, designer.extendOptions(options, {
            serverApi: {
                getSemanticModelsList: baseServerApi.getSemanticModelsList,
                getSemanticModelSummary: baseServerApi.getSemanticModelSummary,
                getSemanticDataSourceAndDataSet: baseServerApi.getSemanticDataSourceAndDataSet,
                isSemanticDataSource: baseServerApi.isSemanticDataSource,
                getSemanticDataSourceInfo: baseServerApi.getSemanticDataSourceInfo,

                getDataSourcesList: baseServerApi.getDataSourcesList,
                getDataSetsList: baseServerApi.getDataSetsList,
                getServerDataSetInfo: baseServerApi.getServerDataSetInfo,

                getDataSourcesAndDataSets: baseServerApi.getDataSourcesAndDataSets,
            },
            onClose: function () {
                options.onClose();
                if (!openInPanel) hideElement(dataSetPickerDialogId);
                dataSetPicker.dispose();
                showDesigner();
            }
        }));
    };

    designerOptions.dataSetPicker.close = function () {
        dataSetPicker.dispose();
    };

    var templateId = '';
    designerOptions.restoreUnsavedReport = !templateId;
    designer.renderApplication(designerId, designerOptions).then(function () {
        if (!templateId) return;

        designer.api.createReport({
            templateInfo: {
                id: templateId,
            },
        });
    });

    return {
        createReport: () => {
            designer.api.createReport({})
            document.getElementById('wyn-designer-root').style.display = ''
        },
        openReport: (report) => {
            const reportInfo = { 
                id: report.id,
                name: report.name,
                permissions: ['all']
            }
            designer.api.openReport({ reportInfo })
            document.getElementById('wyn-designer-root').style.display = ''
        },
        close: () => {
            document.getElementById('wyn-designer-root').style.display = 'none'
        }
    }
}
