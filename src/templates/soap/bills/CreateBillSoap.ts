import {BaseSoapTemplate} from "../BaseSoapTemplate";
import {Bill} from "../../../models/Bill";
import {EBillType} from "../../../common/enum/eBill";
import moment = require("moment");
import {BillCreditMemo} from "../../../models/BillCreditMemo";
import {urlencoded} from "express";
import {roundDecimals} from "../../../common/helper/helpers";
const toXML = require("to-xml").toXML;

export class CreateBillSoap extends BaseSoapTemplate {

    private bill;

    private type : EBillType;

    private note: BillCreditMemo;

    constructor(bill: Bill, type, note) {
        super();
        this.bill = bill;
        this.type = type;
        this.note = note;
    }

    getData() {

        const bill : Bill = this.bill;
        const billNumber = 36; //bill.id;

        const order = bill.order;

        const customer = bill.order.customer;

        if(!customer.email){
            customer['email'] = 'facturacionlucymodas@gmail.com';
        }

        const orderDelivery = bill.order.orderDelivery;

        const billConfig = bill.billConfig;

        const CustomerState = customer.state;
        const CustomerMunicipality = customer.municipality;

        const departamento = {
            codigo : "05",
            nombre : "ANTIOQUIA"
        };
        const ciudad = {
            codigo : "05380",
            nombre : "LA ESTRELLA"
        };
        const pais = {
            nombre : "Colombia",
            codigo : "CO"
        };
        const moneda = 'COP';
        const empresa = {
            'nombre' : 'LUCY MODAS COLOMBIA',
            'nombre_completo' : 'LUCY MODAS COLOMBIA SAS',
            'nit' : '901092426',
            'direccion' : 'CL. 73 SUR #63 AA - 185',
            'telefono' : '(4) 6103863',
            'email' : 'facturacionlucymodas@gmail.com',
            'responsabilidad_fiscal' : 'ZZ',
            'tipo_regimen' : '05',
            'tipo_operacion' : '10',
            'tipo_empresa' : 1,
            'tipo_id' : 31
        };


        /** Calculo de Facturación */

        let monto_venta = 0;
        let monto_venta_sin_iva = 0;
        let restante = 0;

        let total = 0;
        let subtotal = 0;
        let impuestos = 0;

        let InvcDtl = [];
        let InvcTax = [];

        const iva = 1.19;

        /** Calculo de productos para facturación */
        order.orderDetails.forEach((producto, index) => {

            producto['valor_unitario'] = 0;
            producto['valor_total'] = 0;

            producto['precio_venta'] = parseFloat(producto.price.toString()) / 100 * (100 - parseFloat(producto.discountPercent.toString()));

            monto_venta += producto['precio_venta'] * producto.quantity;
            monto_venta_sin_iva = monto_venta / iva;
            restante = monto_venta_sin_iva - subtotal;

            if(index === (order.orderDetails.length - 1)){
                producto['precio_venta'] = restante * 1.19 / producto.quantity;
            }

            producto['valor_unitario'] = (parseFloat(producto['precio_venta']) * 100) / (100 + parseFloat(bill.tax.toString()));
            producto['valor_unitario'] = roundDecimals(producto['valor_unitario']);
            producto['valor_total'] = producto.quantity * parseFloat(producto['valor_unitario']);
            producto['valor_iva'] =  (producto['valor_total'] * parseFloat(bill.tax.toString())) / 100;
            producto['valor_iva'] = roundDecimals(producto['valor_iva']);
            subtotal += parseFloat(producto['valor_total']);
            impuestos += parseFloat(producto['valor_iva']);

            InvcDtl.push({
                'Company' : empresa.nit,
                'InvoiceNum' : billNumber,
                'InvoiceLine' : (index + 1),
                'PartNum' : producto['id'],
                'LineDesc' : producto['id'] + ' - ' + producto.size + ' - ' + producto.color,
                'PartNumPartDescription' : producto.id + ' - ' + producto.size + ' - ' + producto.color,
                'SellingShipQty' : producto.quantity,
                'SalesUM' : 94,
                'UnitPrice' : roundDecimals(producto['valor_unitario'], false),
                'DocUnitPrice' : roundDecimals(producto['valor_unitario'], false),
                'DocExtPrice' : roundDecimals(producto['valor_total'], false),
                'DspDocExtPrice' : roundDecimals(producto['valor_total'], false),
                'DiscountPercent' : 0,
                'Discount' : 0,
                'DocDiscount' : 0,
                'DspDocLessDiscount' : 0,
                'DspDocTotalMiscChrg' : 0,
                'CurrencyCode' : moneda
            });

            InvcTax.push({
                    'Company' : empresa['nit'],
                    'InvoiceNum' : billConfig.prefix + bill.legalNumber,
                    'InvoiceLine' : (index + 1),
                    'CurrencyCode' : moneda,
                    'RateCode' : 'IVA 19',
                    'DocTaxableAmt' : roundDecimals(producto['valor_total'], false),
                    'TaxAmt' : roundDecimals(producto['valor_iva'], false),
                    'DocTaxAmt' : roundDecimals(producto['valor_iva'], false),
                    'Percent' : parseFloat(bill.tax.toString()),
                    'WithholdingTax_c' : false
            });

        });

        //total
        orderDelivery.deliveryCost = orderDelivery.deliveryCost ? parseFloat(orderDelivery.deliveryCost.toString()) : 0;

        total = parseFloat(subtotal.toString()) + parseFloat(impuestos.toString()) + orderDelivery.deliveryCost;

        const InvcHead = {
            'Company' : empresa['nit'],
            'InvoiceType' : 'InvoiceType',
            'InvoiceNum' : billNumber,
            'LegalNumber' : billConfig.prefix + bill.legalNumber,
            'InvoiceRef' : '',
            'CustNum' : customer.document,
            'ContactName' : customer.name,
            'CustomerName' : customer.name,
            'InvoiceDate' :  moment(bill.createdAt).format('MM/DD/YYYY HH:mm:ss'),
            'DueDate' : moment(bill.createdAt).format('MM/DD/YYYY HH:mm:ss'),
            'DspDocSubTotal' : roundDecimals(subtotal, false),
            'DocTaxAmt' : roundDecimals(impuestos, false),
            'DocWHTaxAmt' : '0',
            'DspDocInvoiceAmt' : roundDecimals(total, false),
            'InvoiceComment' : '',
            'CurrencyCodeCurrencyID' : moneda,
            'CurrencyCode' : moneda,
            'NumResol' : billConfig.number,
            'OrderNum' : billNumber,
            'Resolution1' : 'Numeración de facturación electrónica según resolución DIAN No. ' + billConfig.number + ' del ' + moment(billConfig.resolutionDate).format('YYYY-MM-DD') + ' de ' + billConfig.prefix + billConfig.startNumber + ' a ' + billConfig.prefix + billConfig.finalNumber,
            'Discount' : 0,
            'PaymentMeansID_c' : 1,
            'PaymentMeansDescription' : 'Contado',
            'PaymentMeansCode_c' : 10,
            'PaymentDurationMeasure' : 0,
            'PaymentDueDate' : moment(bill.createdAt).format('YYYY-MM-DD')
        };

        const Customer = {
            'Company': empresa['nit'],
            'CustID': customer.document,
            'CustNum': customer.document,
            'ResaleID': customer.document,
            'Name': customer.name,
            'Address1': customer.address || "no registrada",
            'EMailAddress': customer.email,
            'PhoneNum':customer.phone,
            'CurrencyCode': moneda,
            'RegimeType_c': empresa['tipo_regimen'],
            'FiscalResposability_c': empresa['responsabilidad_fiscal'],
            'IdentificationType': 13,
            'Country': pais.nombre,
            'State': CustomerState.name,
            'StateNum': CustomerState.dianCode,
            'City': CustomerMunicipality.name,
            'CityNum': CustomerMunicipality.dianCode
        };

        const Company = {
            'Company' : empresa.nit,
            'StateTaxID' : empresa.nit,
            'Name' : empresa.nombre_completo,
            'FiscalResposability_c' : empresa.responsabilidad_fiscal,
            'OperationType_c' : empresa.tipo_operacion,
            'CompanyType_c' : empresa.tipo_empresa,
            'RegimeType_c' : empresa.tipo_regimen,
            'State' : departamento.nombre,
            'StateNum' : departamento.codigo,
            'City' : ciudad.nombre,
            'CityNum' : ciudad.codigo,
            'IdentificationType' : empresa.tipo_id,
            'Address1' : empresa.direccion,
            'Country' : pais.nombre,
            'PhoneNum' : empresa.telefono,
            'Email' : empresa.email
        };
        const COOneTime = {
            'Company' : empresa.nit,
            'IdentificationType' : 13,
            'COOneTimeID' : customer.document,
            'Name' : customer.name,
            'CountryCode' : pais.codigo,
            'CompanyName': empresa.nombre
        };
        const SalesTRC = {
            'Company' : empresa.nit,
            'RateCode' : 'IVA 19',
            'TaxCode' : 'IVA',
            'Description' : 'IVA 19',
            'IdImpDIAN_c' : '01'
    };
        //flete
        const InvcMisc = {
            'Company' : empresa.nit,
            'InvoiceNum' : billNumber,
            'InvoiceLine' : 0,
            'MiscCode' : 'Flete',
            'Description' : 'Flete',
            'MiscAmt' : roundDecimals(orderDelivery.deliveryCost, false),
            'DocMiscAmt' : roundDecimals(orderDelivery.deliveryCost, false),
            'MiscCodeDescription' : 'Flete',
            'Percentage' : 0,
            'MiscBaseAmt' : 0
    };
        /** Agregar ns1:InvoiceType para tods .. */
        /** Nota de credito o nota de debito */
        if(([EBillType.CREDIT,EBillType.DEBIT].includes(this.type)) && this.note){
            if(this.type == EBillType.CREDIT){
                InvcHead['InvoiceType'] = EBillType.CREDIT;
                InvcHead['CMReasonCode_c'] = 2;
                InvcHead['CMReasonDesc_c'] = 'Anulación de factura electrónica';
                Company['OperationType_c'] = '20';
            }else if(this.type == EBillType.DEBIT){
                InvcHead['InvoiceType'] = EBillType.DEBIT;
                InvcHead['DMReasonCode_c'] = 4;
                InvcHead['DMReasonDesc_c'] = 'Otros';
                Company['OperationType_c'] = '30';

                //clean values
                InvcDtl = undefined;
                InvcTax = undefined;
            }
            InvcHead['InvoiceRef'] = InvcHead['LegalNumber'];
            InvcHead['LegalNumber'] = "1" + this.note.id.toString();
        }



        const data = {
            "?": "xml version=\"1.0\" encoding=\"utf-8\"",
            'ARInvoiceDataSet' : {
            'InvcHead' : InvcHead,
            'InvcDtl' : InvcDtl,
            'InvcTax' : InvcTax,
            'SalesTRC' : SalesTRC,
            'Customer' : Customer,
            'Company' : Company,
            'COOneTime' : COOneTime
            }
        };

        if(orderDelivery.deliveryCost > 0){
            data['ARInvoiceDataSet']['InvcMisc'] = InvcMisc;
        }

        //remove all unuset values
        ['InvcDtl', 'InvcTax'].forEach(item => {
            if(!data[item]){
                delete data[item];
            }
        });

        //format result for invoice
        const result = {
            prmInvoiceType: this.type,
            prmXmlARInvoice: toXML(data, null, false)
        };

        return result;
    }
}
