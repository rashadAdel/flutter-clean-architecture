import { getProjectName, writeFile } from "./utils";

export function createCoreFiles() {
  createErrorsFiles();
  createRoutesFile();
  createStringsFiles();
  createThemeFiles();
  createUiFiles();
  createUtilsFiles();
}

export function createPubspec() {
  const content: string = `name: clean_architecture
description: create project with clean

publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=2.17.1 <3.0.0"

dependencies:
  flutter_localizations:
    sdk: flutter
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
    - assets/animation/
    - assets/sounds/
    - assets/icons/
    - assets/image/
    - assets/fonts/

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
            return child!;
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
  import '../ui/screens/home_screen.dart';
  import '../ui/screens/unknown_screen.dart';
  import 'package:flutter/material.dart';
  
  Route<dynamic> generateRoute(RouteSettings routeSettings) {
    switch (routeSettings.name) {
      case AppRoutes.HOME:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      default:
        return MaterialPageRoute(
            builder: (_) => UnknownScreen(name: routeSettings.name ?? "null"));
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

  //home_screen
  content = `import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const Center(child: Text("homeScreen"));
  }
}
`;
  writeFile("lib/core/ui/screens/home_screen.dart", content);

  //unknown_screen
  content = `import 'package:flutter/material.dart';

  class UnknownScreen extends StatelessWidget {
    const UnknownScreen({Key? key, required this.name}) : super(key: key);
  
    final String name;
  //! edit it
    @override
    Widget build(BuildContext context) {
      return TextButton(
        child: const Icon(Icons.arrow_back),
        onPressed: () {
          Navigator.of(context).pop();
        },
      );
    }
  }
  `;
  writeFile("lib/core/ui/screens/unknown_screen.dart", content);
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

  showMessage(String message, BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }
  `;
  writeFile("lib/core/utils/tools.dart", content);
}
