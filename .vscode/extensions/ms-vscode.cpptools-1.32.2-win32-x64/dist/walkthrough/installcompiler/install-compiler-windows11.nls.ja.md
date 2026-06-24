<h1 data-loc-id="walkthrough.windows.install.compiler">Windows で C++ コンパイラをインストールする</h1>
<p data-loc-id="walkthrough.windows.text1">Windows 向けの C++ 開発を行っている場合は、Microsoft Visual C++ (MSVC) コンパイラをインストールすることをお勧めします。</p>
<ol>
<li><p data-loc-id="walkthrough.windows.text2">MSVC をインストールするには、VS Code ターミナルを開き (CTRL + `)、次のコマンドを貼り付けます:</p>
<p><code>winget install Microsoft.<wbr>VisualStudio.<wbr>2022.<wbr>BuildTools --force --override "--wait --passive --add Microsoft.<wbr>VisualStudio.<wbr>Workload.<wbr>VCTools --add Microsoft.<wbr>VisualStudio.<wbr>Component.<wbr>VC.<wbr>Tools.<wbr>x86.<wbr>x64 --add Microsoft.<wbr>VisualStudio.<wbr>Component.<wbr>Windows11SDK.<wbr>26100"</code></p>
<blockquote>
<p><strong data-loc-id="walkthrough.windows.note1">メモ</strong>: <span data-loc-id="walkthrough.windows.note1.text">有効な Visual Studio ライセンス (Community、Pro、Enterprise のいずれか) があり、その C++ コードベースの開発に積極的に使用している場合は、Visual Studio Build Tools の C++ ツールセットを Visual Studio Code と合わせて使用して、C++ コードベースのコンパイル、ビルド、および検証を行うことができます。</span></p>
</blockquote>
</li>
</ol>
<h2 data-loc-id="walkthrough.windows.verify.compiler">コンパイラのインストールの確認中</h2>
<ol>
<li><p data-loc-id="walkthrough.windows.open.command.prompt">Windows スタート メニューで <code>developer</code> と入力して、<strong>Developer Command Prompt for VS</strong> を開きます。</p>
</li>
<li><p data-loc-id="walkthrough.windows.check.install"><span>Developer Command Prompt for VS</span> に「<code>cl</code>」と入力して、MSVC のインストールを確認します。バージョンと基本的な使用法の説明とともに、著作権に関するメッセージが表示されます。</p>
</li>
</ol>
<h2 data-loc-id="walkthrough.windows.other.compilers">その他のコンパイラ オプション</h2>
<p data-loc-id="walkthrough.windows.text3">Windows から Linux に貼り付ける場合は、<a href="https://code.visualstudio.com/docs/cpp/config-wsl" data-loc-id="walkthrough.windows.link.title1">VS Code で C++ と Windows Subsystem for Linux (WSL) を使用する</a> をチェックしてください。あるいは、<a href="https://code.visualstudio.com/docs/cpp/config-mingw" data-loc-id="walkthrough.windows.link.title2">MinGW を使用して Windows で GCC をインストールする</a> も使用できます。</p>