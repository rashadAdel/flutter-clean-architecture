import fs = require("fs");
import path = require("path");
import * as vscode from "vscode";
import {
  createFolders,
  editFile,
  getProjectName,
  showMessage,
  terminalCommend,
  writeFile,
} from "./utils";

export function createCoreFiles() {
  createErrorsFiles();
  createRoutesFile();
  createStringsFiles();
  createThemeFiles();
  createUiFiles();
  createUtilsFiles();
  createExtensionsFiles();
}

function createExtensionsFiles() {
  const content = `extension IntegerExtension on int {
    Duration get days => Duration(days: this);
    Duration get hours => Duration(hours: this);
    Duration get minutes => Duration(minutes: this);
    Duration get seconds => Duration(seconds: this);
    Duration get milliseconds => Duration(milliseconds: this);
    Duration get microSeconds => Duration(microseconds: this);
  }
  `;

  writeFile("lib/shared/extensions/integer_extension.dart", content);
}
export function createPubspec() {
  const content: string = `name: ${getProjectName()}
description: create project with clean

publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=2.17.1 <3.0.0"

dependencies:
  flutter:
    sdk: flutter

  internet_connection_checker: ^0.0.1+3
  flutter_screenutil: ^5.5.3+2
  shared_preferences: ^2.0.15
  cupertino_icons: ^1.0.2
  flutter_bloc: ^8.0.1
  equatable: ^2.0.3
  get_it: ^7.2.0
  dartz: ^0.10.1
  http: ^0.13.4
  intl: ^0.17.0

# #to make native splash screen
# # 1) change path image_path
# # 2) run commend -> flutter pub run flutter_native_splash:create
#   flutter_native_splash: ^2.1.1
# flutter_native_splash:
#   background_image: assets/image/splash_background.png # choose one color or background
#   color: "#ffffff"
#   image: assets/icons/icon.png

# # to change icon
# # 1) change path image_path
# # 2) run commend -> flutter pub run flutter_launcher_icons:main
#   flutter_launcher_icons: ^0.9.2
# flutter_icons:
#   android: true
#   ios: true
#   remove_alpha_ios: true
#   image_path: "assets/icons/icon.png"

dev_dependencies:
  flutter_test:
    sdk: flutter

  flutter_lints: ^2.0.0
flutter:
  generate: true
  uses-material-design: true

  assets:
  - assets/icons/
  - assets/images/
  - assets/animations/

`;
  writeFile("pubspec.yaml", content);
}
export function createMain() {
  const content: string = `import 'package:flutter/material.dart';  
import 'package:flutter_bloc/flutter_bloc.dart';  
import 'package:flutter_screenutil/flutter_screenutil.dart';  
  
import 'shared/routes/app_pages.dart';  
import 'shared/constants/app_routes.dart';  
import 'shared/theme/app_theme.dart';  
import 'shared/theme/cubit/theme_cubit.dart';  
import 'shared/injection/injector.dart' ;  
  
void main() async {  
  WidgetsFlutterBinding.ensureInitialized();  
  await Injector.init();  
  runApp(  
    const MyApp(),  
  );  
}  
  
class MyApp extends StatelessWidget {  
  const MyApp({Key? key}) : super(key: key);  
  
  @override  
  Widget build(BuildContext context) {  
    return MultiBlocProvider(  
        providers: [  
          BlocProvider(create: (_) => Injector.instance<ThemeCubit>()),  
        ],  
        child:  
            BlocBuilder<ThemeCubit, ThemeState>(builder: (context, themeState) {  
          return materialApp(themeState);  
        }));  
  }  
  
  MaterialApp materialApp(ThemeState themeState) {  
    return MaterialApp(  
      navigatorKey: navigator,
      themeMode: themeState.themeMode,  
      theme: lightTheme,  
      darkTheme: darkTheme,  
      initialRoute: AppRoutes.HOME,  
      onGenerateRoute: generateRoute,  
      debugShowCheckedModeBanner: false,  
      builder: screenUtil,  
    );  
  }  
  
  Widget screenUtil(_, child) => ScreenUtilInit(  
        builder: (BuildContext context, Widget? child) {  
          return Scaffold(body: child!);
        },  
        //! TODO: change it if u want use ScreenUtil  
        designSize: const Size(360, 690),  
        child: child,  
      );  
}  
`;
  writeFile("lib/main.dart", content);
}
function createErrorsFiles() {
  //error
  var content: string = `abstract class AppException implements Exception {
    final String message;
  
    AppException({required this.message});
  }
  
  class ServerException extends AppException {
    ServerException({required super.message});
  }
  
  class OfflineException extends AppException {
    OfflineException({required super.message});
  }
  
  class EmptyCachedException extends AppException {
    EmptyCachedException({required super.message});
  }
  `;
  writeFile("lib/shared/errors/app_exception.dart", content);
  // Failure
  content = `import 'package:equatable/equatable.dart';

  import 'app_exception.dart';
  
  abstract class AppFailure extends Equatable {
    final String message;
  
    const AppFailure({required this.message});
    AppException get exception;
  
    @override
    List<Object?> get props => [message, exception];
  }
  
  class ServerFailure extends AppFailure {
    const ServerFailure({required super.message});
  
    @override
    AppException get exception => ServerException(message: message);
  }
  
  class OfflineFailure extends AppFailure {
    const OfflineFailure({required super.message});
  
    @override
    AppException get exception => OfflineException(message: message);
  }
  
  class EmptyCachedFailure extends AppFailure {
    const EmptyCachedFailure({required super.message});
  
    @override
    AppException get exception => EmptyCachedException(message: message);
  }
  `;
  writeFile("lib/shared/errors/failure.dart", content);
}
function createRoutesFile() {
  const content: string = `import '../constants/app_routes.dart';  
import '../ui/pages/home_page.dart';  
import '../ui/pages/unknown_page.dart';  
import 'package:flutter/material.dart';  

GlobalKey<NavigatorState> navigator = GlobalKey<NavigatorState>();

Route<dynamic> generateRoute(RouteSettings routeSettings) {  
  switch (routeSettings.name) {  
    case AppRoutes.HOME:  
      return MaterialPageRoute(settings: routeSettings,builder: (_) => const HomePage());  
    default:  
      return MaterialPageRoute(  
        settings: routeSettings,
          builder: (_) => UnknownPage(name: routeSettings.name ?? "null"));  
  }  
}  
`;
  writeFile("/lib/shared/routes/app_pages.dart", content);
}
function createStringsFiles() {
  //colors
  var content: string = `
class AppColors {}  
  `;
  writeFile("lib/shared/constants/app_colors.dart", content);
  //app_info
  content = `
// ignore_for_file: constant_identifier_names
const APP_NAME = "${getProjectName()}";
const title = '${getProjectName()}';
const appIdAndroid = "";
const appIdIos = "";
const masterAdminEmail = "";
const googleMapsKey = '';
const googleMapsKeyURL = '';
`;
  writeFile("lib/shared/configs/app_info.dart", content);
  //app_routes
  content = `// ignore_for_file: constant_identifier_names  
 class AppRoutes {  
  static const HOME = '/';  
  static const UNKNOWN = '/404';  
}  
`;
  writeFile("lib/shared/constants/app_routes.dart", content);
}
function createThemeFiles() {
  //app_theme
  var content: string = `import '../constants/app_colors.dart';  
import 'package:flutter/material.dart';  
  
final darkTheme = ThemeData(  
);  
  
final lightTheme = ThemeData();  
`;
  writeFile("lib/shared/theme/app_theme.dart", content);
  //cubit
  content = `import 'package:equatable/equatable.dart';  
import 'package:flutter/material.dart';  
import 'package:flutter_bloc/flutter_bloc.dart';  
import 'package:shared_preferences/shared_preferences.dart';  
  
import '../../injection/injector.dart';  
  
part 'theme_state.dart';  
  
SharedPreferences _localStorage = Injector.instance();  
const String _keyStorage = "themeMode";  
  
class ThemeCubit extends Cubit<ThemeState> {  
  ThemeCubit() : super(ThemeInitial.state);  
  
  changeThemeMode(ThemeMode themeMode) {  
    emit(ThemeState(themeMode: themeMode));  
    _localStorage.setString(_keyStorage, "$themeMode");  
  }  
}  
`;
  writeFile("lib/shared/theme/cubit/theme_cubit.dart", content);
  //theme_state
  content = `part of 'theme_cubit.dart';  
 class ThemeState extends Equatable {  
  final ThemeMode themeMode;  
  
  const ThemeState({required this.themeMode});  
  @override  
  List<Object> get props => [themeMode];  
}  
  
class ThemeInitial {  
  static ThemeState get state {  
    return ThemeState(themeMode: _getThemeModeFromStorage);  
  }  
}  
  
ThemeMode get _getThemeModeFromStorage {  
  switch (_localStorage.getString(_keyStorage)) {  
    case "ThemeMode.dark":  
      return ThemeMode.dark;  
    case "ThemeMode.light":  
      return ThemeMode.dark;  
    case "ThemeMode.system":  
      return ThemeMode.system;  
    default:  
      return ThemeMode.system;  
  }  
}  
`;
  writeFile("lib/shared/theme/cubit/theme_state.dart", content);
}
function createUiFiles() {
  //responsive_layout
  var content: string = `import 'package:flutter/material.dart';

  class ResponsiveLayout extends StatelessWidget {
    final Widget desktop;
    final Widget? tablet;
    final Widget mobile;
  
    const ResponsiveLayout({
      Key? key,
      required this.desktop,
      this.tablet,
      required this.mobile,
    }) : super(key: key);
  
    static bool isMobile(BuildContext context) {
      return MediaQuery.of(context).size.width < 600;
    }
  
    static bool isTablet(BuildContext context) {
      return MediaQuery.of(context).size.width >= 600 &&
          MediaQuery.of(context).size.width < 1200;
    }
  
    static bool isDesktop(BuildContext context) {
      return MediaQuery.of(context).size.width >= 1200;
    }
  
    @override
    Widget build(BuildContext context) {
      Size size = MediaQuery.of(context).size;
      if (size.width > 1200) {
        return desktop;
      } else if (size.width > 800 && size.width < 1200) {
        return tablet ?? desktop;
      } else {
        return mobile;
      }
    }
  }
  `;
  writeFile("lib/shared/ui/layouts/responsive_layout.dart", content);

  //on change size
  content = `import 'package:flutter/material.dart';
  import 'package:flutter/rendering.dart';
  
  typedef OnWidgetSizeChange = void Function(Size size);
  
  class MeasureSizeRenderObject extends RenderProxyBox {
    Size? oldSize;
    final OnWidgetSizeChange onChange;
  
    MeasureSizeRenderObject(this.onChange);
  
    @override
    void performLayout() {
      super.performLayout();
  
      Size newSize = child!.size;
      if (oldSize == newSize) return;
  
      oldSize = newSize;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        onChange(newSize);
      });
    }
  }
  
  class MeasureSize extends SingleChildRenderObjectWidget {
    final OnWidgetSizeChange onChange;
  
    const MeasureSize({
      Key? key,
      required this.onChange,
      required Widget child,
    }) : super(key: key, child: child);
  
    @override
    RenderObject createRenderObject(BuildContext context) {
      return MeasureSizeRenderObject(onChange);
    }
  }
  `;
  writeFile("lib/shared/ui/layouts/on_change_size_layout.dart", content);

  //home_page
  content = `import 'package:flutter/material.dart'; 
class HomePage extends StatelessWidget {  
const HomePage({Key? key}) : super(key: key);  
 @override  
Widget build(BuildContext context) {  
  return const Center(child: Text("homePage"));  
}
}
`;
  writeFile("lib/shared/ui/pages/home_page.dart", content);
  //unknown_page
  content = `import 'package:flutter/material.dart';
  import 'package:flutter_screenutil/flutter_screenutil.dart';

  import '../../constants/app_routes.dart';  
  class UnknownPage extends StatelessWidget {
    const UnknownPage({Key? key, required this.name}) : super(key: key);
  
    final String name;
    @override
    Widget build(BuildContext context) {
      return Container(
        color: Colors.red,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.back_hand, color: Colors.white),
                  SizedBox(height: 100.h),
                  Text(
                    ' "\${name.replaceFirst("/", "")}" page not found',
                    style: const TextStyle(color: Colors.white),
                  ),
                ],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).pushReplacementNamed(AppRoutes.HOME);
                    },
                    child: Row(
                      children: const [
                        Icon(Icons.home),
                        Text("Go Home"),
                      ],
                    ),
                  ),
                ],
              )
            ],
          ),
        ),
      );
    }
  }
  `;
  writeFile("lib/shared/ui/pages/unknown_page.dart", content);
}
function createUtilsFiles() {
  //injection
  var content: string = `import 'package:get_it/get_it.dart';
  import 'package:internet_connection_checker/internet_connection_checker.dart';
  import 'package:shared_preferences/shared_preferences.dart';
  
  import '../theme/cubit/theme_cubit.dart';
  import '../utils/network_info.dart';
  
  class Injector {
    static GetIt instance = GetIt.I;
    static Future<void> init() async {
      await _initShared();
      await _features();
    }
  
    static _features() {}
  
    static _initShared() async {
      //ThemeBloc
      instance.registerFactory(() => ThemeCubit());
      //SharedPreferences
      SharedPreferences shared = await SharedPreferences.getInstance();
      instance.registerLazySingleton(() => shared);
      //network info
      instance
          .registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl(instance()));
      instance.registerLazySingleton(() => InternetConnectionChecker());
    }
  }
  `;
  writeFile("lib/shared/injection/injector.dart", content);
  //network_info
  content = `import 'package:internet_connection_checker/internet_connection_checker.dart';  
  
abstract class NetworkInfo {  
  Future<bool> get isConnected;  
}  
  
class NetworkInfoImpl implements NetworkInfo {  
  final InternetConnectionChecker connectionChecker;  
  
  NetworkInfoImpl(this.connectionChecker);  
  @override  
  Future<bool> get isConnected => connectionChecker.hasConnection;  
}  
`;
  writeFile("lib/shared/utils/network_info.dart", content);
  //tools
  content = `import 'package:flutter/material.dart';

  import '../routes/app_pages.dart';
  
  showMessage(String message) {
    ScaffoldMessenger.of(navigator.currentContext!).showSnackBar(SnackBar(
        backgroundColor: Colors.green,
        content: Text(
          message,
          style: const TextStyle(color: Colors.white),
        )));
  }
  
  showError(String message) {
    ScaffoldMessenger.of(navigator.currentContext!).showSnackBar(SnackBar(
        backgroundColor: Colors.red,
        content: Text(
          message,
          style: const TextStyle(color: Colors.white),
        )));
  }
  `;
  writeFile("lib/shared/utils/tools.dart", content);
}
export async function createLocalizationsFiles() {
  createFolders([
    "lib/shared/l10n",
    "lib/shared/l10n/cubit",
    "lib/shared/l10n/json",
  ]);

  //l10.yaml
  var content: string = `
arb-dir: lib/shared/l10n/json
template-arb-file: app_en.arb
output-localization-file: app_localizations.dart
`;
  writeFile("l10n.yaml", content);
  //locale cubit
  content = `// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart'; 
import '../../injection/injector.dart'; 
part 'locale_state.dart'; 
SharedPreferences localStorage = Injector.instance();
const _keyStorage = "language"; 
class LocaleCubit extends Cubit<LocaleState> {  
LocaleCubit() : super(LocaleInitial.state);  
 toArabic() {  
  emit(const LocaleState(locale: Locale("ar")));  
  localStorage.setString(_keyStorage, "ar");  
}  
 toEnglish() {  
  emit(const LocaleState(locale: Locale("en")));  
  localStorage.setString(_keyStorage, "en");  
}  
 toAnotherLanguage() {  
  String languageCode = state.locale.languageCode;  
  String otherLanguageCode = languageCode == "en" ? "ar" : "en";  
  emit(LocaleState(locale: Locale(otherLanguageCode)));  
  localStorage.setString(_keyStorage, otherLanguageCode);  
}
}
`;
  writeFile("lib/shared/l10n/cubit/locale_cubit.dart", content);
  //locale state
  content = `part of 'locale_cubit.dart'; 
class LocaleState extends Equatable {  
final Locale locale;  
const LocaleState({required this.locale});  
 @override  
List<Object> get props => [locale];
} 
class LocaleInitial {  
static LocaleState get state {  
  String languageCode =  
      localStorage.getString(_keyStorage) ?? Intl.systemLocale;  
  final fixed = languageCode.startsWith("ar") ? 'ar' : "en";  
  Locale locale = Locale(fixed);  
  return LocaleState(locale: locale);  
}
}
`;
  writeFile("lib/shared/l10n/cubit/locale_state.dart", content);
  //json ar
  content = `{  
"home":"الصفحة الرئيسية"
}`;
  writeFile("lib/shared/l10n/json/app_ar.arb", content);
  //json en
  content = `
{  
"home":"Home"
}`;
  writeFile("lib/shared/l10n/json/app_en.arb", content);
  //translation

  content = `import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart'; 
AppLocalizations translate(BuildContext context) {  
return AppLocalizations.of(context)!;
}
`;
  writeFile("lib/shared/utils/translation.dart", content);
  //injection
  editFile(
    "lib/shared/utils/injections.dart",
    `get_it/get_it.dart';`,
    `get_it/get_it.dart';
import '../l10n/cubit/locale_cubit.dart'; 
   `
  );
  editFile(
    "lib/shared/injection/injector.dart",
    "_initCore() async {",
    `_initCore() async {  
//LocaleBloc  
instance.registerFactory(() => LocaleCubit());`
  );
  //pubspec.yaml
  editFile(
    "pubspec.yaml",
    "\ndependencies:\n",
    `
dependencies:  
  flutter_localizations:  
    sdk: flutter
`
  );
  addLocalizationToMain();

  terminalCommend("flutter gen-l10n");
  showMessage("Localization added");
}
function addLocalizationToMain() {
  const pathMain = "lib/main.dart";
  //add import
  editFile(
    pathMain,
    "import 'package:flutter/material.dart';",
    `import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'shared/l10n/cubit/locale_cubit.dart';`
  );
  //provider
  editFile(
    pathMain,
    "providers: [",
    "providers: [BlocProvider(create: (_) => Injector.instance<LocaleCubit>()),"
  );
  //builder
  editFile(
    pathMain,
    "materialApp(themeState);",
    `BlocBuilder<LocaleCubit, LocaleState>(
    builder: (context, localeState) {
      return materialApp(localeState, themeState);
    },
  );`
  );
  //materialAppConstructor
  editFile(
    pathMain,
    `MaterialApp materialApp(ThemeState themeState) {`,
    `MaterialApp materialApp(LocaleState localeState, ThemeState themeState) {`
  );
  //add localization to Material
  editFile(
    pathMain,
    `MaterialApp(`,
    `MaterialApp(
        supportedLocales: AppLocalizations.supportedLocales,
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        locale: localeState.locale,`
  );
}

export function createBlocOrCubit(blocName: string, featureName?: string) {
  vscode.window
    .showQuickPick(
      [
        { label: "bloc", description: "Use bloc" },
        { label: "cubit", description: "use cubit" },
      ],
      {
        canPickMany: false,
        placeHolder: "which state management do u want use?",
      }
    )
    .then((state) => {
      if (state !== undefined) {
        const featurePath = `lib/features/${featureName ?? blocName}`;
        const isBloc: boolean = state?.label === "bloc";
        const pathBloc: string = `${featurePath}/presentation/${state?.label}/${blocName}`;
        createFolders([
          `${featurePath}/presentation/${state?.label}`,
          pathBloc,
        ]);

        //state
        var content: string = `part of '${blocName}_${state?.label}.dart';
    abstract class ${capitalizeName(blocName)}State extends Equatable {
      const ${capitalizeName(blocName)}State();
    
      @override
      List<Object> get props => [];
    }
    class ${capitalizeName(blocName)}Initial extends ${capitalizeName(
          blocName
        )}State {}
    `;
        writeFile(`${pathBloc}/${blocName}_state.dart`, content);

        if (isBloc) {
          //events
          content = `part of '${blocName}_bloc.dart';
    abstract class ${capitalizeName(blocName)}Event extends Equatable {
      const ${capitalizeName(blocName)}Event();
    
      @override
      List<Object> get props => [];
    }
    `;
          writeFile(`${pathBloc}/${blocName}_event.dart`, content);
          //bloc
          content = `import 'package:bloc/bloc.dart';
      import 'package:equatable/equatable.dart';
      
      part '${blocName}_event.dart';
      part '${blocName}_state.dart';
      
      class ${capitalizeName(blocName)}Bloc extends Bloc<${capitalizeName(
            blocName
          )}Event, ${capitalizeName(blocName)}State> {
        ${capitalizeName(blocName)}Bloc() : super(${capitalizeName(
            blocName
          )}Initial()) {
          on<${capitalizeName(blocName)}Event>((event, emit) {
            // TODO: implement event handler
          });
        }
      }
      `;
          writeFile(`${pathBloc}/${blocName}_bloc.dart`, content);
        } else {
          content = `import 'package:bloc/bloc.dart';
      import 'package:equatable/equatable.dart';
      
      part '${blocName}_state.dart';
      
      class ${capitalizeName(blocName)}Cubit extends Cubit<${capitalizeName(
            blocName
          )}State> {
        ${capitalizeName(blocName)}Cubit() : super(${capitalizeName(
            blocName
          )}Initial());
          

      }
      `;
          writeFile(`${pathBloc}/${blocName}_cubit.dart`, content);
        }

        //import
        editFile(
          `${featurePath}/helper/injection/${featureName}_injector.dart`,
          `import '../../../../../shared/injection/injector.dart';`,
          `import '../../../../../shared/injection/injector.dart';
           import '../../presentation/${state.label.toLowerCase()}/${blocName}/${blocName}_${state.label.toLowerCase()}.dart';`
        );
        //inject
        editFile(
          `${featurePath}/helper/injection/${featureName}_injector.dart`,
          `// ============ ${state.label.toUpperCase()}S ============`,
          `// ============ ${state.label.toUpperCase()}S ============
            _injector.registerFactory(() => ${capitalizeName(
              blocName
            )}${capitalizeName(state.label)}());
            `
        );
        //static
        editFile(
          `${featurePath}/helper/injection/${featureName}_injector.dart`,
          `// ============ STATICS ============`,
          `// ============ STATICS ============
            static final ${capitalizeName(blocName)}${capitalizeName(
            state.label
          )} _${smallFirst(capitalizeName(blocName))}${capitalizeName(
            state.label
          )} = _injector.get<${capitalizeName(blocName)}${capitalizeName(
            state.label
          )}>();`
        );
      } else {
        showMessage("please select type");
        createBlocOrCubit(blocName, featureName);
      }
    });
}
export function friendlyText(text: string) {
  var _newText = text.toLowerCase();
  _newText = removeSpecialCharacters(_newText);
  _newText = removeAccents(_newText);
  _newText = _newText.replaceAll(/\s/g, "_");

  return _newText.trim();
}

export function createFeatureFiles(featureName: string) {
  //Exception
  var content = `import '../../../../../shared/errors/app_exception.dart';

  class ${capitalizeName(featureName)}Exception extends AppException {
    ${capitalizeName(featureName)}Exception({required super.message});
  }
  `;
  writeFile(
    `lib/features/${featureName}/helper/errors/${featureName}_exceptions.dart`,
    content
  );
  //Failure
  var content = `import '../../../../shared/errors/failure.dart';
  import '${featureName}_exceptions.dart';
  
  class ${capitalizeName(featureName)}Failure extends AppFailure {
    const ${capitalizeName(featureName)}Failure({required super.message});
  
    @override
    ${capitalizeName(featureName)}Exception get exception => ${capitalizeName(
    featureName
  )}Exception(message: message);
  }
  `;
  writeFile(
    `lib/features/${featureName}/helper/errors/${featureName}_failures.dart`,
    content
  );
  //injector
  var content = `import '../../../../../shared/injection/injector.dart';
  
  class ${capitalizeName(featureName)}Injector {
    // ============ Variables ============
    static final _injector = Injector.instance;
  
    // ============ STATICS ============
  
    static void inject() {
      // ============ BLOCS ============

      // ============ CUBITS ============

      // ============ USECASES ============
  
      // ============ REPOSITORIES ============
  
      // ============ REMOTE DATASOURCES ============
  
      // ============ LOCAL DATASOURCES ============
  
      // ============ HELPER ============
    }
  }
  `;
  writeFile(
    `lib/features/${featureName}/helper/injection/${featureName}_injector.dart`,
    content
  );
}

export function capitalizeName(text: string) {
  var _newText = text.replaceAll("_", " ");
  var lowerCase = _newText.replaceAll(/\b[a-z]/g, (match) =>
    match.toUpperCase()
  );
  var _newText2 = lowerCase.replaceAll(" ", "");
  return _newText2.trim();
}

function removeAccents(str: string) {
  return str.normalize("NFD").replaceAll(/[\u0300-\u036f]/g, "");
}

function removeSpecialCharacters(str: string) {
  return str.replaceAll(/[^\w\s]/gi, "");
}

export function transformUrlName(str: string) {
  return str.replaceAll("_", "-");
}

function capitalize(s: string) {
  return s[0].toUpperCase() + s.substring(1);
}
function smallFirst(s: string) {
  return s[0].toLowerCase() + s.substring(1);
}

export function inject(featureName: string) {
  //import
  editFile(
    "lib/shared/injection/injector.dart",
    "import 'package:get_it/get_it.dart';",
    `import 'package:get_it/get_it.dart';
    import '../../features/${capitalizeName(
      featureName
    )}/helper/injection/${capitalizeName(featureName)}_injector.dart';
    `
  );

  //inject
  editFile(
    "lib/shared/injection/injector.dart",
    "static _features() {",
    `static _features() {
    ${capitalizeName(featureName)}Injector.inject();`
  );
}
