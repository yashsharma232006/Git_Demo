<h1 data-loc-id="walkthrough.windows.install.compiler">Установка компилятора C++ в Windows</h1>
<p data-loc-id="walkthrough.windows.text1">Если вы занимаетесь разработкой на C++ для Windows, рекомендуется установить компилятор Microsoft Visual C++ (MSVC).</p>
<ol>
<li><p data-loc-id="walkthrough.windows.text2">Чтобы установить MSVC, откройте терминал VS Code (CTRL + `) и вставьте следующую команду:</p>
<p><code>winget install Microsoft.<wbr>VisualStudio.<wbr>2022.<wbr>BuildTools --force --override "--wait --passive --add Microsoft.<wbr>VisualStudio.<wbr>Workload.<wbr>VCTools --add Microsoft.<wbr>VisualStudio.<wbr>Component.<wbr>VC.<wbr>Tools.<wbr>x86.<wbr>x64 --add Microsoft.<wbr>VisualStudio.<wbr>Component.<wbr>Windows10SDK.<wbr>19041"</code></p>
<blockquote>
<p><strong data-loc-id="walkthrough.windows.note1">Примечание</strong>: <span data-loc-id="walkthrough.windows.note1.text">Вы можете использовать набор инструментов C++ из пакета Visual Studio Build Tools вместе с Visual Studio Code для компиляции, сборки и проверки любой базы кода C++, если у вас есть действующая лицензия Visual Studio (Community, Pro или Enterprise), которой вы активно пользуетесь для разработки этой базы кода C++.</span></p>
</blockquote>
</li>
</ol>
<h2 data-loc-id="walkthrough.windows.verify.compiler">Проверка установки компилятора</h2>
<ol>
<li><p data-loc-id="walkthrough.windows.open.command.prompt">Откройте <strong>Developer Command Prompt for VS</strong> путем ввода <code>developer</code> в меню "Пуск" в Windows.</p>
</li>
<li><p data-loc-id="walkthrough.windows.check.install">Проверьте установку MSVC, введя "<code>cl</code>" в <span>Developer Command Prompt for VS</span>. Должно появиться сообщение об авторских правах с номером версии и кратким описанием использования.</p>
</li>
</ol>
<h2 data-loc-id="walkthrough.windows.other.compilers">Другие параметры компилятора</h2>
<p data-loc-id="walkthrough.windows.text3">Если вы нацеливаетесь на Linux из Windows, ознакомьтесь с <a href="https://code.visualstudio.com/docs/cpp/config-wsl" data-loc-id="walkthrough.windows.link.title1">Использование C++ и подсистемы Windows для Linux в VS Code</a>. Также вы можете <a href="https://code.visualstudio.com/docs/cpp/config-mingw" data-loc-id="walkthrough.windows.link.title2">Установка GCC в Windows с помощью MinGW</a>.</p>