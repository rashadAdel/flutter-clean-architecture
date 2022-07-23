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
  
import 'core/routes/app_pages.dart';  
import 'core/strings/app_routes.dart';  
import 'core/theme/app_theme.dart';  
import 'core/theme/cubit/theme_cubit.dart';  
import 'core/utils/injections.dart' as injection;  
  
void main() async {  
  WidgetsFlutterBinding.ensureInitialized();  
  await injection.init();  
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
          BlocProvider(create: (_) => injection.instance<ThemeCubit>()),  
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
  var content: string = `
class ServerException implements Exception {} 
class OfflineException implements Exception {} 
class EmptyCachedException implements Exception {}  
  `;
  writeFile("lib/core/errors/exception.dart", content);
  // Failure
  content = `
import 'package:equatable/equatable.dart'; 
abstract class Failure extends Equatable {} 
class ServerFailure extends Failure {  
  @override  
  List<Object?> get props => [];
} 
class OfflineFailure extends Failure {  
  @override  
  List<Object?> get props => [];
} 
class EmptyCachedFailure extends Failure {  
  @override  
  List<Object?> get props => [];
}
`;
  writeFile("lib/core/errors/failure.dart", content);
}
function createRoutesFile() {
  const content: string = `import '../strings/app_routes.dart';  
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
  writeFile("/lib/core/routes/app_pages.dart", content);
}
function createStringsFiles() {
  //colors
  var content: string = `
import 'package:flutter/cupertino.dart'; 
class AppColors {  
static const Color primaryDark = Color(0xFF091619);  
static const Color primaryLight = Color(0xFFFFFFFF);  
static const Color secondaryDark = Color(0xFF0B2328);  
static const Color secondaryLight = Color(0xFF1663FE);
}  
  `;
  writeFile("lib/core/strings/app_colors.dart", content);
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
  writeFile("lib/core/strings/app_info.dart", content);
  //app_routes
  content = `// ignore_for_file: constant_identifier_names  
 class AppRoutes {  
  static const HOME = '/';  
  static const UNKNOWN = '/404';  
}  
`;
  writeFile("lib/core/strings/app_routes.dart", content);
}
function createThemeFiles() {
  //app_theme
  var content: string = `import '../strings/app_colors.dart';  
import 'package:flutter/material.dart';  
  
final darkTheme = ThemeData(  
  primaryColor: AppColors.primaryDark,  
);  
  
final lightTheme = ThemeData(primaryColor: AppColors.primaryLight);  
`;
  writeFile("lib/core/theme/app_theme.dart", content);
  //cubit
  content = `import 'package:equatable/equatable.dart';  
import 'package:flutter/material.dart';  
import 'package:flutter_bloc/flutter_bloc.dart';  
import 'package:shared_preferences/shared_preferences.dart';  
  
import '../../utils/injections.dart' as injection;  
  
part 'theme_state.dart';  
  
SharedPreferences _localStorage = injection.instance();  
const String _keyStorage = "themeMode";  
  
class ThemeCubit extends Cubit<ThemeState> {  
  ThemeCubit() : super(ThemeInitial.state);  
  
  changeThemeMode(ThemeMode themeMode) {  
    emit(ThemeState(themeMode: themeMode));  
    _localStorage.setString(_keyStorage, "$themeMode");  
  }  
}  
`;
  writeFile("lib/core/theme/cubit/theme_cubit.dart", content);
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
  writeFile("lib/core/theme/cubit/theme_state.dart", content);
}
function createUiFiles() {
  //responsive_layout
  var content: string = `// ignore_for_file: must_be_immutable

  import 'package:flutter/material.dart';
  
  class ResponsiveLayout extends StatelessWidget {
    final Widget desktop;
    Widget? tablet;
    final Widget mobile;
  
    ResponsiveLayout({
      Key? key,
      required this.desktop,
      this.tablet,
      required this.mobile,
    }) : super(key: key);
  
    @override
    Widget build(BuildContext context) {
      return LayoutBuilder(
        builder: (context, constraints) {
          if (constraints.maxWidth > 1200) {
            return desktop;
          } else if (constraints.maxWidth > 800 && constraints.maxWidth < 1200) {
            return tablet ?? desktop;
          } else {
            return mobile;
          }
        },
      );
    }
  }
  `;
  writeFile("lib/core/ui/layouts/responsive_layout.dart", content);
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
  writeFile("lib/core/ui/pages/home_page.dart", content);
  //unknown_page
  content = `import 'package:flutter/material.dart';
  import 'package:flutter_screenutil/flutter_screenutil.dart';

  import '../../strings/app_routes.dart';  
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
  writeFile("lib/core/ui/pages/unknown_page.dart", content);
}
function createUtilsFiles() {
  //injection
  var content: string = `import 'package:get_it/get_it.dart';
import 'package:internet_connection_checker/internet_connection_checker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../theme/cubit/theme_cubit.dart';
import 'network_info.dart';  
  
final GetIt instance = GetIt.I;  
  
Future<void> init() async {  
  await _initCore();  
  await _features();  
}  
  
_features() {  
}  
  
_initCore() async {  
  //SharedPreferences  
  SharedPreferences shared = await SharedPreferences.getInstance();  
  instance.registerLazySingleton(() => shared);  
  //network info  
  instance  
      .registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl(instance()));  
  instance.registerLazySingleton(() => InternetConnectionChecker());  
  
  //ThemeBloc  
  instance.registerFactory(() => ThemeCubit());  
}  
`;
  writeFile("lib/core/utils/injections.dart", content);
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
  writeFile("lib/core/utils/network_info.dart", content);
  //tools
  content = `import 'package:flutter/material.dart';  
  showMessage(String message) {
    ScaffoldMessenger.of(navigator.currentContext!)
        .showSnackBar(SnackBar(content: Text(message)));
  }
}  
`;
  writeFile("lib/core/utils/tools.dart", content);
}
export async function createLocalizationsFiles() {
  createFolders(["lib/core/l10n", "lib/core/l10n/cubit", "lib/core/l10n/json"]);

  //l10.yaml
  var content: string = `
arb-dir: lib/core/l10n/json
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
import '../../utils/injections.dart' as injection; 
part 'locale_state.dart'; 
SharedPreferences localStorage = injection.instance();
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
  writeFile("lib/core/l10n/cubit/locale_cubit.dart", content);
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
  writeFile("lib/core/l10n/cubit/locale_state.dart", content);
  //json ar
  content = `{  
"home":"الصفحة الرئيسية"
}`;
  writeFile("lib/core/l10n/json/app_ar.arb", content);
  //json en
  content = `
{  
"home":"Home"
}`;
  writeFile("lib/core/l10n/json/app_en.arb", content);
  //translation

  content = `import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart'; 
AppLocalizations translate(BuildContext context) {  
return AppLocalizations.of(context)!;
}
`;
  writeFile("lib/core/utils/translation.dart", content);
  //injection
  editFile(
    "lib/core/utils/injections.dart",
    `get_it/get_it.dart';`,
    `get_it/get_it.dart';
import '../l10n/cubit/locale_cubit.dart'; 
   `
  );
  editFile(
    "lib/core/utils/injections.dart",
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
import 'core/l10n/cubit/locale_cubit.dart';`
  );
  //provider
  editFile(
    pathMain,
    "providers: [",
    "providers: [BlocProvider(create: (_) => injection.instance<LocaleCubit>()),"
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

export function createBlocOrCubit(
  featureName: string,
  anotherFeatureName?: string
) {
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
        const isBloc: boolean = state?.label === "bloc";
        const pathBloc: string = `lib/features/${
          anotherFeatureName ?? featureName
        }/presentation/${state?.label}/${featureName}`;
        createFolders([
          `lib/features/${anotherFeatureName ?? featureName}/presentation/${
            state?.label
          }`,
          pathBloc,
        ]);

        //state
        var content: string = `part of '${featureName}_${state?.label}.dart';
    abstract class ${capitalizeName(featureName)}State extends Equatable {
      const ${capitalizeName(featureName)}State();
    
      @override
      List<Object> get props => [];
    }
    class ${capitalizeName(featureName)}Initial extends ${capitalizeName(
          featureName
        )}State {}
    `;
        writeFile(`${pathBloc}/${featureName}_state.dart`, content);

        if (isBloc) {
          //events
          content = `part of '${featureName}_bloc.dart';
    abstract class ${capitalizeName(featureName)}Event extends Equatable {
      const ${capitalizeName(featureName)}Event();
    
      @override
      List<Object> get props => [];
    }
    `;
          writeFile(`${pathBloc}/${featureName}_event.dart`, content);
          //bloc
          content = `import 'package:bloc/bloc.dart';
      import 'package:equatable/equatable.dart';
      
      part '${featureName}_event.dart';
      part '${featureName}_state.dart';
      
      class ${capitalizeName(featureName)}Bloc extends Bloc<${capitalizeName(
            featureName
          )}Event, ${capitalizeName(featureName)}State> {
        ${capitalizeName(featureName)}Bloc() : super(${capitalizeName(
            featureName
          )}Initial()) {
          on<${capitalizeName(featureName)}Event>((event, emit) {
            // TODO: implement event handler
          });
        }
      }
      `;
          writeFile(`${pathBloc}/${featureName}_bloc.dart`, content);
        } else {
          content = `import 'package:bloc/bloc.dart';
      import 'package:equatable/equatable.dart';
      
      part '${featureName}_state.dart';
      
      class ${capitalizeName(featureName)}Cubit extends Cubit<${capitalizeName(
            featureName
          )}State> {
        ${capitalizeName(featureName)}Cubit() : super(${capitalizeName(
            featureName
          )}Initial());
      }
      `;
          writeFile(`${pathBloc}/${featureName}_cubit.dart`, content);
        }
      } else {
        showMessage("please select type");
        createBlocOrCubit(featureName, anotherFeatureName);
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
